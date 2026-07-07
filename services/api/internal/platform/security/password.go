package security

import (
	"crypto/sha256"
	"encoding/hex"

	"golang.org/x/crypto/bcrypt"
)

const bcryptCost = 12

// BcryptHasher adapts the package-level helpers to the domain.PasswordHasher
// port so usecases depend on an interface, never on bcrypt directly.
type BcryptHasher struct{}

// Hash implements domain.PasswordHasher.
func (BcryptHasher) Hash(plain string) (string, error) { return HashPassword(plain) }

// Compare implements domain.PasswordHasher.
func (BcryptHasher) Compare(plain, hash string) bool { return ComparePassword(plain, hash) }

// HashPassword returns a bcrypt hash of a user-chosen password.
func HashPassword(password string) (string, error) {
	b, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// ComparePassword reports whether password matches the stored bcrypt hash.
func ComparePassword(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

// HashRefreshToken returns a SHA-256 hex digest of an opaque refresh token.
// Refresh tokens are already high-entropy, so a fast digest (not bcrypt) is the
// correct choice — we only ever store/look up the hash, never the raw token.
func HashRefreshToken(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}
