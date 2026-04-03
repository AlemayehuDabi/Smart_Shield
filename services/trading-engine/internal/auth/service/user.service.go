package service

import (
	"errors"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/dto"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
	UserRepo "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/repository"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg"
)

type AuthService struct {
	repo *UserRepo.UserRespository
	jwtString string
}


// sign-up
func (s *AuthService ) Register(input dto.RegisterInput) (*domain.User, error) {
	// hash
	hashedPassword, _ := pkg.HashPassword(input.Password)

	// store
	userModel := &model.UserModel{
		Email: input.Email,
		Password: hashedPassword,
	}

	// create user
	err := s.repo.Create(userModel)

	// check if there is error
	if err != nil {
		return nil, err
	}

	// return 
	return &domain.User{
		ID: userModel.ID,
		Email: userModel.Email,
		Role: userModel.Role,
		Password: userModel.Password,
	}, nil

}

// login
func (s AuthService) Login(input dto.LoginInput) (dto.AuthResponse, error) {
	// Fetch user
	user, err := s.repo.FindByEmail(input.Email)
	if err != nil {
		return dto.AuthResponse{}, errors.New("user not found")
	}

	// compare input password to stored password and cont accordingly
	if !pkg.ComparePassword(input.Password, user.Password) {
		return dto.AuthResponse{}, errors.New("invalid password")
	}
	// generate token
	token, err := pkg.GenerateJWT(user.ID)

	// Handle token error
	if err != nil {
		return dto.AuthResponse{}, errors.New("failed to generate token")
	}

	// return
	return dto.AuthResponse{
		JwtToken: token,
	}, nil
}

// get-user-profile

// change-password