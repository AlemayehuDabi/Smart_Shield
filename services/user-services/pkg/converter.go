package pkg

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/model"
)

func ToDomain(u *model.UserModel) *domain.User {
	if u == nil {
		return nil
	}
	return &domain.User{
		ID:       u.ID,
		Email:    u.Email,
		Name:     u.Name,
		Password: u.Password,
		Role:    domain.Role(u.Role),
	}
}


func ToModel(u *domain.User) *model.UserModel {
	if u == nil {
		return nil
	}
	return &model.UserModel{
		ID: u.ID,
		Email: u.Email,
		Name: u.Name,
		Password: u.Password,
		Role: model.Role(u.Role),
	}
}