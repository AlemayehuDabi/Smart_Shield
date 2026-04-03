package repositories

import "gorm.io/gorm"

type UserRespository struct {
	db *gorm.DB
}

func NewRespository(db *gorm.DB) *UserRespository {
	return &UserRespository{db: db}
}

// create new user

// get user by email

// get user by id

// update the user

// delete the user