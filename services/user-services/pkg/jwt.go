package pkg

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken = errors.New("invalid token")
)

type CustomClaims struct {
	Role string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateJWT issues an HS256 JWT with subject = userID and 24h expiry.
func GenerateJWT(secret []byte, userID string) (string, error) {
	if len(secret) == 0 {
		return "", errors.New("jwt secret is empty")
	}
	claims := jwt.RegisteredClaims{
		Subject:   userID,
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

// ParseJWTSubject validates the token and returns the subject (user id).
func ParseJWTSubject(secret []byte, tokenString string) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(t *jwt.Token) (any, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method %v", t.Header["alg"])
		}
		return secret, nil
	})

	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || claims.Subject == "" {
		return nil, ErrInvalidToken
	}

	return claims, nil
}