package main

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/config"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graph"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)


func main () {
	// config
	cfg := config.LoadConfig()

	// DB connection using config
	db, err := gorm.Open(postgres.Open(cfg.DbURL), &gorm.Config{})
	if err != nil {
 		panic(err)
	}

	// ✅ Dependency injection
    // userRepo := repository.NewUserRepo(db)
    // userService := service.NewUserService(userRepo, cfg.JwtSecret)

	 deps := &graph.Dependencies{
        // UserService: userService,
    }
	
	gqlHandler := graph.NewHandler(deps) // GraphQL setup
	
	r := gin.Default()
	r.POST("/graphql", gin.WrapH(gqlHandler))        // GraphQL endpoint

	r.Run(":" + cfg.Port)
}