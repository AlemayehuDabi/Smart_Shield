package domain

import (
	"context"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
)

type AuthResponse struct {
	JwtToken string
	User     *domain.User
}

type RegisterInput struct {
	Email    string
	Password string
	Name     string
}

type LoginInput struct {
	Email    string
	Password string
}

type AuthUsecase interface {
	Register(ctx context.Context, input RegisterInput) (*AuthResponse, error)
	Login(ctx context.Context, input LoginInput) (*AuthResponse, error)
}
