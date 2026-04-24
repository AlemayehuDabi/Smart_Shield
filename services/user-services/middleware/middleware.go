package middleware

import (
	"strings"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/config"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
	"github.com/gin-gonic/gin"
)

func AuthMiddleware(cfg *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {

		token := extractToken(ctx)
		claims, err := pkg.ParseJWTSubject([]byte(cfg.JwtSecret), token)

		if err != nil {
			ctx.AbortWithStatus(401)
			return
		}

		ctx.Request = ctx.Request.WithContext(pkg.WithUserID(ctx.Request.Context(), claims.Subject))

		ctx.Next()
	}
}

// extractToken gets JWT from Authorization header
func extractToken(c *gin.Context) string {
	bearerToken := c.GetHeader("Authorization")

	if bearerToken == "" {
		return ""
	}

	// Expected format: "Bearer <token>"
	parts := strings.Split(bearerToken, " ")

	if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
		return ""
	}

	// token
	return parts[1]
}