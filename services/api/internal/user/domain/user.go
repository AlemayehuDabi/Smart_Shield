// Package domain holds the user & auth bounded context's entities and the port
// interfaces its usecases depend on. It imports NO framework, NO SQL, NO GraphQL,
// and no other module — this is the stable core everything else points at.
package domain

import "time"

// Role is an authorization role (orthogonal to billing tier).
type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin"
)

// SubscriptionTier is the billing plan a user is on.
type SubscriptionTier string

const (
	TierFree  SubscriptionTier = "free"
	TierPro   SubscriptionTier = "pro"
	TierElite SubscriptionTier = "elite"
)

// Valid reports whether t is a known tier.
func (t SubscriptionTier) Valid() bool {
	switch t {
	case TierFree, TierPro, TierElite:
		return true
	default:
		return false
	}
}

// RiskTolerance captures onboarding-quiz risk appetite.
type RiskTolerance string

const (
	RiskConservative RiskTolerance = "conservative"
	RiskModerate     RiskTolerance = "moderate"
	RiskAggressive   RiskTolerance = "aggressive"
)

// Valid reports whether r is a known risk tolerance.
func (r RiskTolerance) Valid() bool {
	switch r {
	case RiskConservative, RiskModerate, RiskAggressive:
		return true
	default:
		return false
	}
}

// ExperienceLevel captures onboarding-quiz trading experience.
type ExperienceLevel string

const (
	ExperienceBeginner     ExperienceLevel = "beginner"
	ExperienceIntermediate ExperienceLevel = "intermediate"
	ExperienceAdvanced     ExperienceLevel = "advanced"
)

// Valid reports whether e is a known experience level.
func (e ExperienceLevel) Valid() bool {
	switch e {
	case ExperienceBeginner, ExperienceIntermediate, ExperienceAdvanced:
		return true
	default:
		return false
	}
}

// User is the account/identity aggregate root.
type User struct {
	ID               string
	Email            string
	Name             string
	PasswordHash     string
	Role             Role
	SubscriptionTier SubscriptionTier
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

// Profile is a user's onboarding/preferences data (1:1 with User).
type Profile struct {
	UserID           string
	RiskTolerance    *RiskTolerance
	ExperienceLevel  *ExperienceLevel
	PreferredMarkets []string
	Onboarded        bool
	CreatedAt        time.Time
	UpdatedAt        time.Time
}

// RefreshToken is a persisted, hashed refresh credential.
type RefreshToken struct {
	ID        string
	UserID    string
	TokenHash string
	ExpiresAt time.Time
	RevokedAt *time.Time
	CreatedAt time.Time
}

// IsActive reports whether the token can still be redeemed at time t.
func (rt RefreshToken) IsActive(at time.Time) bool {
	return rt.RevokedAt == nil && at.Before(rt.ExpiresAt)
}

// --- usecase input/output value objects (framework-free) ---------------------

// RegisterInput is the data required to create an account.
type RegisterInput struct {
	Email    string
	Password string
	Name     string
}

// LoginInput carries login credentials.
type LoginInput struct {
	Email    string
	Password string
}

// UpdateProfileInput carries optional profile fields; nil means "leave unchanged".
type UpdateProfileInput struct {
	RiskTolerance    *RiskTolerance
	ExperienceLevel  *ExperienceLevel
	PreferredMarkets *[]string
}

// Tokens is an issued access+refresh pair.
type Tokens struct {
	AccessToken          string
	RefreshToken         string
	AccessTokenExpiresAt time.Time
}

// AuthResult is returned by register/login/refresh.
type AuthResult struct {
	User   *User
	Tokens Tokens
}
