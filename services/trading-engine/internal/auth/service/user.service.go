package service

import (
	"errors"
	"fmt"
	"strings"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/dto"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/repository"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
	"gorm.io/gorm"
)

type AuthService struct {
	repo      *repository.UserRepository
	jwtSecret []byte
}

func NewAuthService(repo *repository.UserRepository, jwtSecret string) *AuthService {
	return &AuthService{
		repo:      repo,
		jwtSecret: []byte(jwtSecret),
	}
}

func (s *AuthService) Register(input dto.RegisterInput) (*dto.AuthResponse, error) {
	if err := validateRegister(input); err != nil {
		return nil, err
	}
	hashedPassword, err := pkg.HashPassword(input.Password)
	if err != nil {
		return nil, fmt.Errorf("hash password: %w", err)
	}

	_, err = s.repo.FindByEmail(strings.TrimSpace(input.Email))
	if err == nil {
		return nil, errors.New("email already registered")
	}
	if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	userModel := &model.UserModel{
		Email:    strings.TrimSpace(strings.ToLower(input.Email)),
		Password: hashedPassword,
		Name:     strings.TrimSpace(input.Name),
		Role:     "user",
	}

	if err := s.repo.Create(userModel); err != nil {
		return nil, err
	}

	token, err := pkg.GenerateJWT(s.jwtSecret, userModel.ID)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &dto.AuthResponse{
		JwtToken: token,
		User: &dto.UserView{
			ID:    userModel.ID,
			Email: userModel.Email,
			Name:  userModel.Name,
			Role:  string(userModel.Role),
		},
	}, nil
}

func (s *AuthService) Login(input dto.LoginInput) (*dto.AuthResponse, error) {
	email := strings.TrimSpace(strings.ToLower(input.Email))
	if email == "" || input.Password == "" {
		return nil, errors.New("invalid email or password")
	}

	user, err := s.repo.FindByEmail(email)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("invalid email or password")
		}
		return nil, err
	}

	if !pkg.ComparePassword(input.Password, user.Password) {
		return nil, errors.New("invalid email or password")
	}

	token, err := pkg.GenerateJWT(s.jwtSecret, user.ID)
	if err != nil {
		return nil, errors.New("failed to generate token")
	}

	return &dto.AuthResponse{
		JwtToken: token,
		User: &dto.UserView{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
			Role:  string(user.Role),
		},
	}, nil
}

func (s *AuthService) GetUserProfile(id string) (*domain.User, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	return &domain.User{
		ID:    user.ID,
		Email: user.Email,
		Name:  user.Name,
		Role:  user.Role,
	}, nil
}

func validateRegister(input dto.RegisterInput) error {
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
