// Package billing holds implementations of domain.BillingProvider. For the MVP
// only a stub exists; a real StripeProvider will live alongside it later and be
// selected in main.go without any usecase change.
package billing

import (
	"context"
	"fmt"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// StripeStub is a no-network stand-in for Stripe. It returns a deterministic
// fake checkout URL and never fails, so the whole subscription flow is
// exercisable end-to-end before any payment integration exists.
type StripeStub struct{}

// NewStripeStub constructs the stub provider.
func NewStripeStub() *StripeStub { return &StripeStub{} }

// CreateCheckout implements domain.BillingProvider.
func (StripeStub) CreateCheckout(_ context.Context, userID string, tier domain.SubscriptionTier) (string, error) {
	return fmt.Sprintf("https://billing.stub.local/checkout?user=%s&tier=%s", userID, tier), nil
}

// Compile-time assurance the stub satisfies the port.
var _ domain.BillingProvider = (*StripeStub)(nil)
