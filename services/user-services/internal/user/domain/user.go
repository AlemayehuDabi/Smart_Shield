package domain

import "context"

type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin"
)

type User struct {
	ID       string
	Email    string
	Name     string
	Role     Role
	Password string
}

type UpdateUserInput struct {
	Name  *string
	Email *string
}

type UserRepository interface {
	Create(ctx context.Context, user *User) error
	FindByEmail(ctx context.Context, email string) (*User, error)
	GetByID(ctx context.Context, id string) (*User, error)
	Update(ctx context.Context, userID string, input UpdateUserInput) (*User, error)
}

type UserUsecase interface {
	GetUserProfile(ctx context.Context, id string) (*User, error)
	UpdateUserProfile(ctx context.Context, userID string, input UpdateUserInput) (*User, error)
}
