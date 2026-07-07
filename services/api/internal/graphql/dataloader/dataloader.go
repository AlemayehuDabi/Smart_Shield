// Package dataloader wires per-request batching to eliminate N+1 queries. The
// canonical case: resolving `Trade.user` for a list of trades — without a loader
// that is one SELECT per trade. Loaders return DOMAIN users; the resolver maps
// them to GraphQL models, so this package never imports the resolver (no cycle).
package dataloader

import (
	"context"
	"net/http"
	"time"

	"github.com/vikstrous/dataloadgen"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	userdomain "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

type ctxKey struct{}

// UserBatcher is the minimal dependency the user loader needs (satisfied by the
// user module's ProfileService).
type UserBatcher interface {
	GetUsersByIDs(ctx context.Context, ids []string) ([]*userdomain.User, error)
}

// Loaders holds all per-request loaders.
type Loaders struct {
	UserByID *dataloadgen.Loader[string, *userdomain.User]
}

// newLoaders builds a fresh set of loaders for a single request.
func newLoaders(users UserBatcher) *Loaders {
	return &Loaders{
		UserByID: dataloadgen.NewLoader(
			userBatchFn(users),
			dataloadgen.WithWait(time.Millisecond),
		),
	}
}

// userBatchFn fetches many users at once and re-aligns them to the requested
// keys (dataloadgen requires the result slice to match the key order).
func userBatchFn(users UserBatcher) func(ctx context.Context, keys []string) ([]*userdomain.User, []error) {
	return func(ctx context.Context, keys []string) ([]*userdomain.User, []error) {
		found, err := users.GetUsersByIDs(ctx, keys)
		if err != nil {
			errs := make([]error, len(keys))
			for i := range errs {
				errs[i] = err
			}
			return make([]*userdomain.User, len(keys)), errs
		}
		byID := make(map[string]*userdomain.User, len(found))
		for _, u := range found {
			byID[u.ID] = u
		}
		out := make([]*userdomain.User, len(keys))
		errs := make([]error, len(keys))
		for i, k := range keys {
			if u, ok := byID[k]; ok {
				out[i] = u
			} else {
				errs[i] = apperror.NotFound("user not found")
			}
		}
		return out, errs
	}
}

// Middleware installs a fresh Loaders into each request's context.
func Middleware(users UserBatcher) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), ctxKey{}, newLoaders(users))
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

// LoadUser batches a user fetch by id for the current request.
func LoadUser(ctx context.Context, id string) (*userdomain.User, error) {
	l, ok := ctx.Value(ctxKey{}).(*Loaders)
	if !ok {
		return nil, apperror.Internal(errNoLoaders)
	}
	return l.UserByID.Load(ctx, id)
}

var errNoLoaders = &loaderError{"dataloaders not present in context"}

type loaderError struct{ msg string }

func (e *loaderError) Error() string { return e.msg }
