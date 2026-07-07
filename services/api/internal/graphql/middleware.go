package graphql

import (
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/ctxkit"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/logger"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/security"
)

const (
	requestIDHeader = "X-Request-ID"
	bearerPrefix    = "Bearer "
)

// RequestID assigns/propagates a correlation id and stores it in the context.
func RequestID() gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.GetHeader(requestIDHeader)
		if id == "" {
			id = uuid.NewString()
		}
		c.Writer.Header().Set(requestIDHeader, id)
		c.Request = c.Request.WithContext(ctxkit.WithRequestID(c.Request.Context(), id))
		c.Next()
	}
}

// Auth is OPTIONAL authentication: a valid bearer token attaches the user id to
// the context; a missing/invalid token is not rejected here (public operations
// like login/register must still pass). Per-field enforcement is the @auth
// directive's job.
func Auth(tm *security.TokenManager) gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if strings.HasPrefix(h, bearerPrefix) {
			raw := strings.TrimSpace(strings.TrimPrefix(h, bearerPrefix))
			if uid, err := tm.ParseAccessToken(raw); err == nil {
				c.Request = c.Request.WithContext(ctxkit.WithUserID(c.Request.Context(), uid))
			}
		}
		c.Next()
	}
}

// Logging injects a request-scoped zap logger (request_id + user_id) and logs a
// summary line once the request completes.
func Logging(base *zap.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := c.Request.Context()
		fields := []zap.Field{zap.String("request_id", ctxkit.RequestID(ctx))}
		if uid, ok := ctxkit.UserID(ctx); ok {
			fields = append(fields, zap.String("user_id", uid))
		}
		reqLog := base.With(fields...)
		c.Request = c.Request.WithContext(logger.WithContext(ctx, reqLog))

		start := time.Now()
		c.Next()

		reqLog.Info("request",
			zap.String("method", c.Request.Method),
			zap.String("path", c.Request.URL.Path),
			zap.Int("status", c.Writer.Status()),
			zap.Duration("latency", time.Since(start)),
		)
	}
}
