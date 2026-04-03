package pkg

import (
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string)(string, error) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), nil
}

func ComparePassword(password string, hasedPassword string) (bool) {
	err := bcrypt.CompareHashAndPassword([]byte(hasedPassword), []byte(password))
	return err == nil
}

