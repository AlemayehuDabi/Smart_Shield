// Package usecase holds the user & auth business logic. It depends only on
// domain ports (repositories, hasher, token issuer) and the shared apperror
// vocabulary — never on pgx, gin, gqlgen, or bcrypt/jwt directly. That is what
// makes it unit-testable with plain mocks and portable if this module is later
// extracted into its own service.
package usecase

import (
	"context"
	"net/mail"
	"strings"
	"time"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

const minPasswordLen = 8

// AuthService implements registration, login, token refresh, and logout.
type AuthService struct {
	users    domain.UserRepository
	tokens   domain.RefreshTokenRepository
	hasher   domain.PasswordHasher
	issuer   domain.TokenIssuer
	nowFn    func() time.Time // injectable clock for deterministic tests
}

// NewAuthService wires the auth usecase from its ports.
func NewAuthService(
	users domain.UserRepository,
	tokens domain.RefreshTokenRepository,
	hasher domain.PasswordHasher,
	issuer domain.TokenIssuer,
) *AuthService {
	return &AuthService{users: users, tokens: tokens, hasher: hasher, issuer: issuer, nowFn: time.Now}
}

// Register creates a new account and returns an initial token pair.
func (s *AuthService) Register(ctx context.Context, in domain.RegisterInput) (*domain.AuthResult, error) {
	email, err := normalizeEmail(in.Email)
	if err != nil {
		return nil, err
	}
	name := strings.TrimSpace(in.Name)
	if name == "" {
		return nil, apperror.InvalidInput("name is required")
	}
	if len(in.Password) < minPasswordLen {
		return nil, apperror.InvalidInput("password must be at least 8 characters")
	}

	// Fail fast on a duplicate; the unique index is the ultimate guard.
	if existing, err := s.users.GetUserByEmail(ctx, email); err == nil && existing != nil {
		return nil, apperror.Conflict("email already registered")
	} else if err != nil && apperror.CodeOf(err) != apperror.CodeNotFound {
		return nil, err
	}

	hash, err := s.hasher.Hash(in.Password)
	if err != nil {
		return nil, apperror.Internal(err)
	}

	user := &domain.User{
		Email:            email,
		Name:             name,
		PasswordHash:     hash,
		Role:             domain.RoleUser,
		SubscriptionTier: domain.TierFree,
	}
	if err := s.users.CreateUser(ctx, user); err != nil {
		return nil, err
	}

	return s.issue(ctx, user)
}

// Login verifies credentials and returns a fresh token pair.
func (s *AuthService) Login(ctx context.Context, in domain.LoginInput) (*domain.AuthResult, error) {
	email, err := normalizeEmail(in.Email)
	if err != nil || in.Password == "" {
		return nil, apperror.Unauthorized("invalid email or password")
	}

	user, err := s.users.GetUserByEmail(ctx, email)
	if err != nil {
		if apperror.CodeOf(err) == apperror.CodeNotFound {
			// Do not leak whether the email exists.
			return nil, apperror.Unauthorized("invalid email or password")
		}
		return nil, err
	}
	if !s.hasher.Compare(in.Password, user.PasswordHash) {
		return nil, apperror.Unauthorized("invalid email or password")
	}
	return s.issue(ctx, user)
}

// Refresh rotates a refresh token: the presented token is revoked and a new
// access+refresh pair is issued. Reuse of a revoked/expired token is rejected.
func (s *AuthService) Refresh(ctx context.Context, rawRefresh string) (*domain.AuthResult, error) {
	if strings.TrimSpace(rawRefresh) == "" {
		return nil, apperror.Unauthorized("missing refresh token")
	}
	hash := s.issuer.HashRefreshToken(rawRefresh)

	stored, err := s.tokens.GetByHash(ctx, hash)
	if err != nil {
		if apperror.CodeOf(err) == apperror.CodeNotFound {
			return nil, apperror.Unauthorized("invalid refresh token")
		}
		return nil, err
	}
	if !stored.IsActive(s.nowFn()) {
		return nil, apperror.Unauthorized("refresh token expired or revoked")
	}

	user, err := s.users.GetUserByID(ctx, stored.UserID)
	if err != nil {
		return nil, err
	}
	// Rotate: kill the presented token before minting a new one.
	if err := s.tokens.Revoke(ctx, hash); err != nil {
		return nil, err
	}
	return s.issue(ctx, user)
}

// Logout revokes the presented refresh token. Idempotent for unknown tokens.
func (s *AuthService) Logout(ctx context.Context, rawRefresh string) error {
	if strings.TrimSpace(rawRefresh) == "" {
		return nil
	}
	hash := s.issuer.HashRefreshToken(rawRefresh)
	if err := s.tokens.Revoke(ctx, hash); err != nil && apperror.CodeOf(err) != apperror.CodeNotFound {
		return err
	}
	return nil
}

// issue mints an access token + a rotating refresh token and persists the latter.
func (s *AuthService) issue(ctx context.Context, user *domain.User) (*domain.AuthResult, error) {
	access, exp, err := s.issuer.IssueAccessToken(user.ID)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	rawRefresh, err := s.issuer.GenerateRefreshToken()
	if err != nil {
		return nil, apperror.Internal(err)
	}
	rt := &domain.RefreshToken{
		UserID:    user.ID,
		TokenHash: s.issuer.HashRefreshToken(rawRefresh),
		ExpiresAt: s.nowFn().Add(s.issuer.RefreshTTL()),
	}
	if err := s.tokens.Store(ctx, rt); err != nil {
		return nil, err
	}
	return &domain.AuthResult{
		User: user,
		Tokens: domain.Tokens{
			AccessToken:          access,
			RefreshToken:         rawRefresh,
			AccessTokenExpiresAt: exp,
		},
	}, nil
}

func normalizeEmail(raw string) (string, error) {
	email := strings.ToLower(strings.TrimSpace(raw))
	if email == "" {
		return "", apperror.InvalidInput("email is required")
	}
	if _, err := mail.ParseAddress(email); err != nil {
		return "", apperror.InvalidInput("invalid email address")
	}
	return email, nil
}
