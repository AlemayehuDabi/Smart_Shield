package domain

import (
	"context"
	"time"
)

// UserRepository persists users and profiles. Implemented in
// internal/user/repository/postgres. Returns apperror.NotFound when a row is
// absent so usecases never see database-specific errors.
type UserRepository interface {
	CreateUser(ctx context.Context, u *User) error
	GetUserByID(ctx context.Context, id string) (*User, error)
	// GetUsersByIDs batches user reads for the Trade.user dataloader (N+1 guard).
	GetUsersByIDs(ctx context.Context, ids []string) ([]*User, error)
	GetUserByEmail(ctx context.Context, email string) (*User, error)
	UpdateSubscriptionTier(ctx context.Context, userID string, tier SubscriptionTier) (*User, error)

	GetProfile(ctx context.Context, userID string) (*Profile, error)
	UpsertProfile(ctx context.Context, p *Profile) (*Profile, error)
}

// RefreshTokenRepository persists hashed refresh tokens for rotation/revocation.
type RefreshTokenRepository interface {
	Store(ctx context.Context, rt *RefreshToken) error
	GetByHash(ctx context.Context, tokenHash string) (*RefreshToken, error)
	Revoke(ctx context.Context, tokenHash string) error
	RevokeAllForUser(ctx context.Context, userID string) error
}

// PasswordHasher abstracts password hashing (implemented by security.BcryptHasher).
type PasswordHasher interface {
	Hash(plain string) (string, error)
	Compare(plain, hash string) bool
}

// TokenIssuer abstracts access/refresh token creation (implemented by
// security.TokenManager). Keeps jwt/crypto out of the usecase layer.
type TokenIssuer interface {
	IssueAccessToken(userID string) (token string, expiresAt time.Time, err error)
	GenerateRefreshToken() (string, error)
	HashRefreshToken(raw string) string
	RefreshTTL() time.Duration
}

// BillingProvider is the port behind which a real Stripe integration will live.
// For the MVP an in-memory stub satisfies it (repository/billing). The usecase
// depends only on this interface, so swapping in Stripe later touches no
// business logic.
type BillingProvider interface {
	// CreateCheckout returns a URL/session the client redirects to. The stub
	// returns a fake URL and treats the change as immediately effective.
	CreateCheckout(ctx context.Context, userID string, tier SubscriptionTier) (checkoutURL string, err error)
}
