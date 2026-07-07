package graphql

import (
	"context"

	gqlgen "github.com/99designs/gqlgen/graphql"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/ctxkit"
)

// AuthDirective implements the schema's @auth directive. Authentication itself
// (validating the JWT and populating identity) happens in the HTTP middleware;
// this directive only enforces that a field requires an authenticated caller.
func AuthDirective(ctx context.Context, _ any, next gqlgen.Resolver) (any, error) {
	if _, ok := ctxkit.UserID(ctx); !ok {
		return nil, apperror.Unauthorized("authentication required")
	}
	return next(ctx)
}
