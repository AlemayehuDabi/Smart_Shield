package pkg

import "context"

type userIDKey struct{}

// WithUserID attaches an authenticated user id to the request context.
func WithUserID(parent context.Context, userID string) context.Context {
	return context.WithValue(parent, userIDKey{}, userID)
}

// UserID returns the authenticated user id and whether it was set.
func UserID(c context.Context) (string, bool) {
	v := c.Value(userIDKey{})
	if v == nil {
		return "", false
	}
	s, ok := v.(string)
	return s, ok && s != ""
}
