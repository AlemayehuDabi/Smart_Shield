package graphql

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/dto"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/service"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql/model"
)

type Resolver struct {
	UserService *service.AuthService
}

func authPayloadToModel(out *dto.AuthResponse) *model.AuthPayload {
	if out == nil {
		return nil
	}
	return &model.AuthPayload{
		Token: out.JwtToken,
		User:  userViewToModel(out.User),
	}
}

func userViewToModel(v *dto.UserView) *model.AuthUser {
	if v == nil {
		return nil
	}
	u := &model.AuthUser{
		ID:    v.ID,
		Email: v.Email,
		Role:  string(v.Role),
	}
	if v.Name != "" {
		n := v.Name
		u.Name = &n
	}
	return u
}

func domainUserToGraphQL(u *domain.User) *model.AuthUser {
	if u == nil {
		return nil
	}
	out := &model.AuthUser{
		ID:    u.ID,
		Email: u.Email,
		Role:  string(u.Role),
	}
	if u.Name != "" {
		n := u.Name
		out.Name = &n
	}
	return out
}
