// Package graphql assembles the gqlgen HTTP handler: it plugs in the resolvers,
// the @auth directive, the domain-error presenter, panic recovery, and standard
// transports. Per-request dataloaders and auth/logging are added as middleware
// (see dataloader.Middleware and the gin middleware in this package).
package graphql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/vektah/gqlparser/v2/ast"
	"go.uber.org/zap"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/generated"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/resolver"
)

// NewServer builds the gqlgen executable schema handler.
func NewServer(res *resolver.Resolver, log *zap.Logger) *handler.Server {
	cfg := generated.Config{Resolvers: res}
	cfg.Directives.Auth = AuthDirective

	srv := handler.New(generated.NewExecutableSchema(cfg))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))
	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{Cache: lru.New[string](100)})
	srv.Use(extension.FixedComplexityLimit(300))

	srv.SetErrorPresenter(NewErrorPresenter())
	srv.SetRecoverFunc(NewRecoverFunc(log))

	return srv
}
