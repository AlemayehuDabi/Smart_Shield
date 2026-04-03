package service

import (
	UserRepo "github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/auth/repository"
)

type UserService struct {
	repo *UserRepo.UserRespository
	jwtString string
}


// sign-up

// login

// get-user-profile

// change-password