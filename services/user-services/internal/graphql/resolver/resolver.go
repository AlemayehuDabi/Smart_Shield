package resolver

import (
	authDomain "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/graphql/model"
	userDomain "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
)

// Resolver serves as dependency injection for your app, add any dependencies you require here.
type Resolver struct {
	UserUsecase userDomain.UserUsecase
	AuthUsecase authDomain.AuthUsecase
}

func authResponseToModel(out *authDomain.AuthResponse) *model.AuthPayload {
	if out == nil {
		return nil
	}
	return &model.AuthPayload{
		Token: out.JwtToken,
		User:  userToAuthModel(out.User),
	}
}

func userToAuthModel(u *userDomain.User) *model.AuthUser {
	if u == nil {
		return nil
	}
	res := &model.AuthUser{
		ID:    u.ID,
		Email: u.Email,
		Role:  string(u.Role),
	}
	if u.Name != "" {
		n := u.Name
		res.Name = &n
	}
	return res
}

func userToModel(u *userDomain.User) *model.User {
	if u == nil {
		return nil
	}
	res := &model.User{
		ID:    u.ID,
		Email: u.Email,
	}
	return res
}
