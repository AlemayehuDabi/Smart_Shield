package domain

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
)

type User struct {
	ID       string
	Email    string
	Name     string
	Role     model.Role
	Password string
}
