// Package ctxkit carries request-scoped identity through context.Context.
// Middleware populates these; usecases read them (e.g. "who is the caller").
package ctxkit

import "context"

type (
	userIDKey    struct{}
	requestIDKey struct{}
)

// WithUserID attaches the authenticated user id.
func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey{}, userID)
}

// UserID returns the authenticated user id and whether one was present.
func UserID(ctx context.Context) (string, bool) {
	s, ok := ctx.Value(userIDKey{}).(string)
	return s, ok && s != ""
}

// WithRequestID attaches a per-request correlation id.
func WithRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey{}, id)
}

// RequestID returns the request correlation id, or "" if none.
func RequestID(ctx context.Context) string {
	s, _ := ctx.Value(requestIDKey{}).(string)
	return s
}
