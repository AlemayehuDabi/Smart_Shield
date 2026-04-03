package pkg

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
)

func ToDomain(u *model.UserModel) (*domain.User) {
	return &domain.User{
		ID: u.ID,
		Email: u.Email,
		Password: u.Password,
		Role: u.Role,
	}
}

