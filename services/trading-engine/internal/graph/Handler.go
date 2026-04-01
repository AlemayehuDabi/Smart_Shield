package graph

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/service"

	"github.com/99designs/gqlgen/graphql/handler"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql/generated"
)

// Dependency Injection
type Dependencies struct {
    UserService *service.UserService
}

func NewHandler(dep *Dependencies) *handler.Server {
    resolver := &Resolver{
        UserService: dep.UserService,
    }

    srv := handler.NewDefaultServer(
        generated.NewExecutableSchema(
            generated.Config{
                Resolvers: resolver,
            },
        ),
    )

    return srv
}