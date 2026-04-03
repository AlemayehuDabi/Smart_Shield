package repositories

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewRespository(db *gorm.DB) *UserRepository {
	return &UserRepository{db: db}
}

// create new user
func (r *UserRepository) Create (user *model.UserModel) error {
	return r.db.Create(user).Error
}

// get user by email
func (r *UserRepository) FindByEmail(email string) (*model.UserModel, error) {
	var user model.UserModel

	err := r.db.Where(user.Email).First(&user).Error

	return &user, err
}

// get user by id
func (r *UserRepository) GetUserByID(id string) (*model.UserModel, error) {
	var user model.UserModel

	err := r.db.First(&user, id).Error
	if err != nil {
		return nil, err
	}

	return &user, nil
}
// update the user



// delete the user