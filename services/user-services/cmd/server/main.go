package main

import (
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/config"
	authUsecase "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/usecase"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/repository"
	userUsecase "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/usecase"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const bearerPrefix = "Bearer "

func main() {
	cfg := config.LoadConfig()

	db, err := gorm.Open(postgres.Open(cfg.DbURL), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// Repository
	userRepo := repository.NewUserRepository(db)

	// Usecase
	authUC := authUsecase.NewAuthUsecase(userRepo, cfg.JwtSecret)
	userUC := userUsecase.NewUserUsecase(userRepo)

	deps := &graphql.Dependencies{
		AuthUsecase: authUC,
		UserUsecase: userUC,
	}

	gqlSrv := graphql.NewHandler(deps)

	r := gin.Default()

	// cors
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	r.GET("/", gin.WrapH(playground.Handler("GraphQL playground", "/graphql")))
	r.POST("/graphql", graphqlGinHandler(gqlSrv, cfg.JwtSecret))

	r.Run(":" + cfg.Port)
}

func graphqlGinHandler(srv *handler.Server, jwtSecret string) gin.HandlerFunc {
	secret := []byte(jwtSecret)
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		h := c.GetHeader("Authorization")

		if strings.HasPrefix(h, bearerPrefix) {
			raw := strings.TrimSpace(h[len(bearerPrefix):])
			if raw != "" {
				if uid, err := pkg.ParseJWTSubject(secret, raw); err == nil && uid.Subject != "" {
					ctx = pkg.WithUserID(ctx, uid.Subject)
				}
			}
		}

		c.Request = c.Request.WithContext(ctx)
		srv.ServeHTTP(c.Writer, c.Request)
	}
}
