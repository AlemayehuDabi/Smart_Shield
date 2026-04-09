package repository

import (
	"errors"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/model"
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

// update the user
func (r *UserRepository) Update(userId string, input model.UserModel) (*model.UserModel, error) {
	var user model.UserModel
	// find the user
	if err := r.db.Find(&user, "id = ?", userId).Error; err != nil {
		return nil, err
	}

	// update map
	updates := map[string]interface{}{}

	if input.Name != nil {
		updates["name"] = *input.Name
	}

	if input.Email != nil {
		updates["email"] = *input.Email
	}

	// nothing to update
	if len(updates) == 0 {
		return nil, errors.New("no fields to update")
	}

	// update from the db
	if err := r.db.Model(&user).Updates(updates).Error; err != nil {
		return nil, err
	}

	return &user, nil
}