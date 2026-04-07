package config

import (
	"os"
	"github.com/joho/godotenv"
	"log"
)

type config struct {
	Port string
	JwtSecret string
	DbURL string
}

func LoadConfig() *config {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}
	
	return &config{
		 Port:      getEnv("PORT", "8080"),
        JwtSecret: getEnv("JWT_SECRET", "supersecret"),
        DbURL:     getEnv("DB_URL", "postgres://user:pass@localhost:5432/db"),
	}
}

func getEnv(key, fallback string) string {
    if val := os.Getenv(key); val != "" {
        return val
    }
    return fallback
}