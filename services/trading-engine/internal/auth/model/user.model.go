package model

import (
	"time"

	"gorm.io/gorm"
)

type Role string

const (
	RoleUser Role="user"
	RoleAdmin Role="admin"
)


// UserModel is the persistence layer for auth users.
type UserModel struct {
	ID        string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	Email     string         `gorm:"uniqueIndex;not null"`
	Password  string         `gorm:"not null"`
	Name      string
	Role    Role  `gorm:"type:user_role;default:'user'"`
}
