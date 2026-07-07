// Package config loads all runtime configuration once, at startup, into a typed
// struct. Nothing else in the codebase should call os.Getenv — inject Config
// (or the specific sub-struct a component needs) via constructors instead.
package config

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

// Config is the fully-parsed application configuration.
//
// The sub-structs are embedded ANONYMOUSLY on purpose: envconfig prefixes named
// nested-struct fields with the field name (so a named `DB Postgres` would look
// for DB_DB_URL). Anonymous embedding keeps each field's env name exactly as its
// tag says (DB_URL, JWT_SECRET, ...). Access them as cfg.Postgres, cfg.Auth, etc.
type Config struct {
	Env      string `envconfig:"APP_ENV" default:"development"`
	Port     string `envconfig:"PORT" default:"8080"`
	LogLevel string `envconfig:"LOG_LEVEL" default:"info"`

	Postgres
	Redis
	Auth
	CORS
}

// Postgres holds pgx pool settings.
type Postgres struct {
	URL      string `envconfig:"DB_URL" required:"true"`
	MaxConns int32  `envconfig:"DB_MAX_CONNS" default:"10"`
	MinConns int32  `envconfig:"DB_MIN_CONNS" default:"2"`
}

// Redis holds cache connection settings.
type Redis struct {
	Addr     string `envconfig:"REDIS_ADDR" default:"localhost:6379"`
	Password string `envconfig:"REDIS_PASSWORD" default:""`
	DB       int    `envconfig:"REDIS_DB" default:"0"`
}

// Auth holds JWT/token settings.
type Auth struct {
	JWTSecret       string        `envconfig:"JWT_SECRET" required:"true"`
	AccessTokenTTL  time.Duration `envconfig:"ACCESS_TOKEN_TTL" default:"15m"`
	RefreshTokenTTL time.Duration `envconfig:"REFRESH_TOKEN_TTL" default:"720h"`
}

// CORS holds cross-origin settings.
type CORS struct {
	AllowedOrigins []string `envconfig:"CORS_ALLOWED_ORIGINS" default:"*"`
}

// IsProduction reports whether we are running in a production environment.
func (c Config) IsProduction() bool { return strings.EqualFold(c.Env, "production") }

// Load reads .env (if present) then the process environment. It returns an error
// rather than panicking so main.go owns the failure path.
func Load() (Config, error) {
	// .env is best-effort: real deployments inject env vars directly.
	_ = godotenv.Load()

	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return Config{}, fmt.Errorf("load config: %w", err)
	}
	if err := cfg.validate(); err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func (c Config) validate() error {
	if c.IsProduction() {
		if len(c.Auth.JWTSecret) < 32 {
			return errors.New("config: JWT_SECRET must be >= 32 bytes in production")
		}
		for _, o := range c.CORS.AllowedOrigins {
			if o == "*" {
				return errors.New("config: CORS_ALLOWED_ORIGINS must not be '*' in production")
			}
		}
	}
	return nil
}
