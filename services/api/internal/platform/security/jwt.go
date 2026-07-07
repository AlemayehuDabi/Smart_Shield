// Package security holds framework-agnostic crypto primitives: JWT issuing /
// verification and password hashing. It has no knowledge of users or HTTP.
package security

import (
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// ErrInvalidToken is returned when an access token fails validation.
var ErrInvalidToken = errors.New("invalid token")

// Claims is the access-token payload. Subject holds the user id.
type Claims struct {
	jwt.RegisteredClaims
}

// TokenManager issues and verifies access tokens and mints opaque refresh
// tokens. It is a pure value type built from config — inject it via constructors.
type TokenManager struct {
	secret     []byte
	accessTTL  time.Duration
	refreshTTL time.Duration
}

// NewTokenManager builds a TokenManager. secret must be non-empty.
func NewTokenManager(secret string, accessTTL, refreshTTL time.Duration) *TokenManager {
	return &TokenManager{secret: []byte(secret), accessTTL: accessTTL, refreshTTL: refreshTTL}
}

// AccessTTL / RefreshTTL expose the configured lifetimes to callers that need to
// compute refresh-token expiry for persistence.
func (m *TokenManager) AccessTTL() time.Duration  { return m.accessTTL }
func (m *TokenManager) RefreshTTL() time.Duration { return m.refreshTTL }

// IssueAccessToken signs a short-lived HS256 access token for userID.
func (m *TokenManager) IssueAccessToken(userID string) (string, time.Time, error) {
	if len(m.secret) == 0 {
		return "", time.Time{}, errors.New("jwt secret is empty")
	}
	now := time.Now()
	exp := now.Add(m.accessTTL)
	claims := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(exp),
		},
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := tok.SignedString(m.secret)
	if err != nil {
		return "", time.Time{}, err
	}
	return signed, exp, nil
}

// ParseAccessToken validates a token and returns its subject (user id).
func (m *TokenManager) ParseAccessToken(raw string) (string, error) {
	tok, err := jwt.ParseWithClaims(raw, &Claims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", t.Header["alg"])
		}
		return m.secret, nil
	})
	if err != nil || !tok.Valid {
		return "", ErrInvalidToken
	}
	claims, ok := tok.Claims.(*Claims)
	if !ok || claims.Subject == "" {
		return "", ErrInvalidToken
	}
	return claims.Subject, nil
}

// HashRefreshToken is exposed as a method so *TokenManager satisfies the
// domain.TokenIssuer port in one value.
func (m *TokenManager) HashRefreshToken(raw string) string { return HashRefreshToken(raw) }

// GenerateRefreshToken returns a cryptographically-random opaque token. Only its
// hash is persisted; the raw value is handed to the client once.
func (m *TokenManager) GenerateRefreshToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}
