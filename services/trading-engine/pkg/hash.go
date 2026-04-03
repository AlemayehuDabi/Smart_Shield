package pkg

import (
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string)(string, error) {
	bytes, _ := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), nil
}

func comparePassword (hasedPassword string, password string) (bool) {
	err := bcrypt.CompareHashAndPassword([]byte(hasedPassword), []byte(password))
	return err == nil
}

