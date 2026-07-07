package resolver

import "context"

// Health is the liveness probe resolver.
func (r *queryResolver) Health(_ context.Context) (string, error) {
	return "ok", nil
}
