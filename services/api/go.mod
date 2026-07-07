module github.com/AlemayehuDabi/smart-shield/services/api

go 1.25.0

require (
	github.com/99designs/gqlgen v0.17.89
	github.com/gin-contrib/cors v1.7.7
	github.com/gin-gonic/gin v1.12.0
	github.com/golang-jwt/jwt/v5 v5.3.1
	github.com/golang-migrate/migrate/v4 v4.18.1
	github.com/google/uuid v1.6.0
	github.com/jackc/pgx/v5 v5.7.2
	github.com/joho/godotenv v1.5.1
	github.com/kelseyhightower/envconfig v1.4.0
	github.com/redis/go-redis/v9 v9.7.0
	github.com/shopspring/decimal v1.4.0
	github.com/stretchr/testify v1.10.0
	github.com/testcontainers/testcontainers-go v0.35.0
	github.com/testcontainers/testcontainers-go/modules/postgres v0.35.0
	github.com/vektah/gqlparser/v2 v2.5.32
	github.com/vikstrous/dataloadgen v0.0.6
	go.uber.org/zap v1.27.0
	golang.org/x/crypto v0.49.0
)

// NOTE: indirect dependencies are intentionally omitted here.
// Run `go mod tidy` once (with network access) to populate them and
// generate go.sum. See the README "First-time setup" section.

tool github.com/99designs/gqlgen
