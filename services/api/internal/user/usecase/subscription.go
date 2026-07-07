package usecase

import (
	"context"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// SubscriptionService reads and changes a user's billing tier. All payment
// mechanics sit behind the domain.BillingProvider port (a stub for the MVP),
// so this logic never knows whether Stripe is real or faked.
type SubscriptionService struct {
	users   domain.UserRepository
	billing domain.BillingProvider
}

// NewSubscriptionService wires the subscription usecase.
func NewSubscriptionService(users domain.UserRepository, billing domain.BillingProvider) *SubscriptionService {
	return &SubscriptionService{users: users, billing: billing}
}

// Get returns the user's current tier.
func (s *SubscriptionService) Get(ctx context.Context, userID string) (domain.SubscriptionTier, error) {
	u, err := s.users.GetUserByID(ctx, userID)
	if err != nil {
		return "", err
	}
	return u.SubscriptionTier, nil
}

// ChangeTierResult is returned by ChangeTier: the (stub) checkout URL plus the
// user reflecting the new tier.
type ChangeTierResult struct {
	CheckoutURL string
	User        *domain.User
}

// ChangeTier starts a plan change. With the stub provider the change is applied
// immediately; with real Stripe this would return a checkout URL and the tier
// would flip on webhook confirmation instead.
func (s *SubscriptionService) ChangeTier(ctx context.Context, userID string, tier domain.SubscriptionTier) (*ChangeTierResult, error) {
	if !tier.Valid() {
		return nil, apperror.InvalidInput("invalid subscription tier")
	}

	checkoutURL, err := s.billing.CreateCheckout(ctx, userID, tier)
	if err != nil {
		return nil, err
	}

	// Stub path: apply the tier now. Replace with webhook-driven update for Stripe.
	user, err := s.users.UpdateSubscriptionTier(ctx, userID, tier)
	if err != nil {
		return nil, err
	}
	return &ChangeTierResult{CheckoutURL: checkoutURL, User: user}, nil
}
