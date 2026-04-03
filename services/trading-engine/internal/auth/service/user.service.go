package service

import (
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

	err := s.repo.Create(userModel)

	if err == nil {
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

// get-user-profile

// change-password