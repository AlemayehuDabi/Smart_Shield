package graphql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	authDomain "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql/generated"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql/resolver"
	userDomain "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/vektah/gqlparser/v2/ast"
)

// Dependencies holds usecases injected into GraphQL resolvers.
type Dependencies struct {
	AuthUsecase authDomain.AuthUsecase
	UserUsecase userDomain.UserUsecase
}

func NewHandler(dep *Dependencies) *handler.Server {
	res := &resolver.Resolver{
		AuthUsecase: dep.AuthUsecase,
		UserUsecase: dep.UserUsecase,
	}

	srv := handler.New(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: res,
			},
		),
	)

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	return srv
}
