package main

import (
	"strings"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/config"
	authctx "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/ctx"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/repository"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/service"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
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

	userRepo := repository.NewRepository(db)
	authSvc := service.NewAuthService(userRepo, cfg.JwtSecret)

	deps := &graphql.Dependencies{
		UserService: authSvc,
	}

	gqlSrv := graphql.NewHandler(deps)

	r := gin.Default()
	r.POST("/graphql", graphqlGinHandler(gqlSrv, cfg.JwtSecret))
	r.Run(":" + cfg.Port)
}

// graphqlGinHandler forwards the request to gqlgen with optional JWT → context user id.
func graphqlGinHandler(srv *handler.Server, jwtSecret string) gin.HandlerFunc {
	secret := []byte(jwtSecret)
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		h := c.GetHeader("Authorization")
		if strings.HasPrefix(h, bearerPrefix) {
			raw := strings.TrimSpace(h[len(bearerPrefix):])
			if raw != "" {
				if uid, err := pkg.ParseJWTSubject(secret, raw); err == nil && uid != "" {
					ctx = authctx.WithUserID(ctx, uid)
				}
			}
		}
		c.Request = c.Request.WithContext(ctx)
		srv.ServeHTTP(c.Writer, c.Request)
	}
}
