package usecase

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	userDomain "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg/apperrors"
	"gorm.io/gorm"
)

type authUsecase struct {
	userRepo  userDomain.UserRepository
	jwtSecret []byte
}

func NewAuthUsecase(userRepo userDomain.UserRepository, jwtSecret string) domain.AuthUsecase {
	return &authUsecase{
		userRepo:  userRepo,
		jwtSecret: []byte(jwtSecret),
	}
}

func (u *authUsecase) Register(ctx context.Context, input domain.RegisterInput) (*domain.AuthResponse, error) {
	if err := validateRegister(input); err != nil {
		return nil, apperrors.NewInvalidInput(err.Error())
	}
	
	hashedPassword, err := pkg.HashPassword(input.Password)
	if err != nil {
		return nil, apperrors.NewInternal(fmt.Sprintf("hash password: %v", err))
	}

	email := strings.TrimSpace(strings.ToLower(input.Email))
	existingUser, err := u.userRepo.FindByEmail(ctx, email)
	if err == nil && existingUser != nil {
		return nil, apperrors.NewAlreadyExists("email already registered")
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, apperrors.NewInternal(err.Error())
	}

	user := &userDomain.User{
		Email:    email,
		Password: hashedPassword,
		Name:     strings.TrimSpace(input.Name),
		Role:     userDomain.RoleUser,
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, apperrors.NewInternal(err.Error())
	}

	token, err := pkg.GenerateJWT(u.jwtSecret, user.ID)
	if err != nil {
		return nil, apperrors.NewInternal("failed to generate token")
	}

	return &domain.AuthResponse{
		JwtToken: token,
		User:     user,
	}, nil
}

func (u *authUsecase) Login(ctx context.Context, input domain.LoginInput) (*domain.AuthResponse, error) {
	email := strings.TrimSpace(strings.ToLower(input.Email))
	if email == "" || input.Password == "" {
		return nil, apperrors.NewInvalidInput("invalid email or password")
	}

	user, err := u.userRepo.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NewUnauthorized("invalid email or password")
		}
		return nil, apperrors.NewInternal(err.Error())
	}

	if !pkg.ComparePassword(input.Password, user.Password) {
		return nil, apperrors.NewUnauthorized("invalid email or password")
	}

	token, err := pkg.GenerateJWT(u.jwtSecret, user.ID)
	if err != nil {
		return nil, apperrors.NewInternal("failed to generate token")
	}

	return &domain.AuthResponse{
		JwtToken: token,
		User:     user,
	}, nil
}

func validateRegister(input domain.RegisterInput) error {
	email := strings.TrimSpace(strings.ToLower(input.Email))
	if len(strings.TrimSpace(input.Name)) < 1 {
		return errors.New("name is required")
	}
	if email == "" || !strings.Contains(email, "@") {
		return errors.New("invalid email")
	}
	if len(input.Password) < 8 {
		return errors.New("password must be at least 8 characters")
	}
	return nil
}
