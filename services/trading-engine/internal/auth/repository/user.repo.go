package repositories

import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/model"
	"gorm.io/gorm"
)

type UserRespository struct {
	db *gorm.DB
}

func NewRespository(db *gorm.DB) *UserRespository {
	return &UserRespository{db: db}
}

// create new user
func (r *UserRespository) Create (user *model.UserModel) error {
	return r.db.Create(user).Error
}

// get user by email
func (r *UserRespository) FindByEmail (email string) (*model.UserModel, error) {
	var user model.UserModel

	err := r.db.Where(user.Email).First(&user).Error

	return &user, err
}

// get user by id

// update the user

// delete the user