# ------------------------------------------------------------------------------
# Smart Shield — API gateway (Go modular monolith)
# ------------------------------------------------------------------------------
SHELL := /bin/bash
BINARY := bin/server
PKG := ./...

# Load .env for the migrate targets (DB_URL etc.) if present.
ifneq (,$(wildcard ./.env))
include .env
export
endif

MIGRATE_DIR := migrations
# golang-migrate wants a URL; DB_URL from .env is reused.
DB_URL ?= postgres://smartshield:smartshield@localhost:5432/smartshield?sslmode=disable

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

.PHONY: run
run: ## Run the API server locally
	go run ./cmd/server

.PHONY: build
build: ## Build the server binary into bin/
	CGO_ENABLED=0 go build -o $(BINARY) ./cmd/server

.PHONY: test
test: ## Run all unit tests (skips integration; see test-integration)
	go test -short -race -cover $(PKG)

.PHONY: test-integration
test-integration: ## Run integration tests (testcontainers; needs Docker)
	go test -race -run Integration -count=1 $(PKG)

.PHONY: lint
lint: ## Run golangci-lint
	golangci-lint run

.PHONY: fmt
fmt: ## Format code
	gofmt -w .
	goimports -w .

.PHONY: generate
generate: ## Run gqlgen + sqlc codegen
	go tool gqlgen generate
	sqlc generate

.PHONY: migrate-up
migrate-up: ## Apply all up migrations
	migrate -path $(MIGRATE_DIR) -database "$(DB_URL)" up

.PHONY: migrate-down
migrate-down: ## Roll back the last migration
	migrate -path $(MIGRATE_DIR) -database "$(DB_URL)" down 1

.PHONY: migrate-create
migrate-create: ## Create a new migration: make migrate-create name=add_x
	migrate create -ext sql -dir $(MIGRATE_DIR) -seq $(name)

.PHONY: docker-up
docker-up: ## Start local Postgres + Redis
	docker compose -f deployments/docker-compose.yml up -d

.PHONY: docker-down
docker-down: ## Stop local Postgres + Redis
	docker compose -f deployments/docker-compose.yml down
