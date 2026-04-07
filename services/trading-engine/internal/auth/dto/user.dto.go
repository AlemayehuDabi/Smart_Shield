package dto

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"

)

type RegisterInput struct {
	Name     string
	Email    string
	Password string
}

type LoginInput struct {
	Email    string
	Password string
}

// AuthResponse is returned by register/login (never send Password on User to clients).
type AuthResponse struct {
	JwtToken string
	User     *UserView
}

// UserView is safe to expose over GraphQL / JSON.
type UserView struct {
	ID    string
	Email string
	Name  string
	Role  string
}

type ChangePasswordInput struct {
	Email    string
	Password string
}
