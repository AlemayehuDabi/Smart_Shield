package graphql

import (
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/service"
)

// Dependencies holds services injected into GraphQL resolvers.
type Dependencies struct {
	UserService *service.AuthService
}

func NewHandler(dep *Dependencies) *handler.Server {
	resolver := &Resolver{
		UserService: dep.UserService,
	}

	return handler.NewDefaultServer(
		NewExecutableSchema(
			Config{
				Resolvers: resolver,
			},
		),
	)
}
