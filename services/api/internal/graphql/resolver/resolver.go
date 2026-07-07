package resolver

import (
	"context"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/generated"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/ctxkit"
	portuc "github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/usecase"
	useruc "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/usecase"
)

//go:generate go run github.com/99designs/gqlgen generate

// Resolver is the dependency-injection root for GraphQL. It holds the per-module
// usecases and nothing else; resolver methods only translate + delegate, which
// is what keeps them thin and keeps business logic out of the transport layer.
type Resolver struct {
	Auth         *useruc.AuthService
	Users        *useruc.ProfileService // named Users to avoid clashing with the userResolver.Profile method
	Subscription *useruc.SubscriptionService
	Trades       *portuc.TradeService
	Analytics    *portuc.AnalyticsService
}

// Root object accessors (gqlgen plumbing). These are idempotent with codegen —
// `make generate` will not duplicate them.
func (r *Resolver) Query() generated.QueryResolver       { return &queryResolver{r} }
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }
func (r *Resolver) User() generated.UserResolver         { return &userResolver{r} }
func (r *Resolver) Trade() generated.TradeResolver       { return &tradeResolver{r} }

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type tradeResolver struct{ *Resolver }

// userIDFromCtx returns the authenticated caller id. Fields guarded by @auth are
// guaranteed to have it; this is a defensive fallback.
func userIDFromCtx(ctx context.Context) (string, error) {
	uid, ok := ctxkit.UserID(ctx)
	if !ok {
		return "", apperror.Unauthorized("authentication required")
	}
	return uid, nil
}
