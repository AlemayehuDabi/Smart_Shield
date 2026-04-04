package repository

import (
	"errors"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// Create persists a new user.
func (r *UserRepository) Create(user *model.UserModel) error {
	return r.db.Create(user).Error
}

// FindByEmail returns a user by email.
func (r *UserRepository) FindByEmail(email string) (*model.UserModel, error) {
	var u model.UserModel
	err := r.db.Where("email = ?", email).First(&u).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}
	return &u, nil
}

// GetUserByID returns a user by primary key.
func (r *UserRepository) GetUserByID(id string) (*model.UserModel, error) {
	var u model.UserModel
	err := r.db.Where("id = ?", id).First(&u).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}
		return nil, err
	}
	return &u, nil
}
