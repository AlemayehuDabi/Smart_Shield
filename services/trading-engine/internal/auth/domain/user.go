package model

import "time"


type User struct {
	ID       string `gorm:"primaryKey;type:uuid;default:uuid_generate_v4()"`
	Email    string `gorm:"unqiye;not null"`
	Password string `gorm:"not null"`
	Role    string `gorm:"default:'user"`
	CreatedAt time.Time
	UpdateAt time.Time
}

