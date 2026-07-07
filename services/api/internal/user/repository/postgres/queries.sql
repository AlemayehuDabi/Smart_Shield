-- Query source for sqlc. `make generate` compiles these into the private `db`
-- package (internal/user/repository/postgres/db), which only the repo adapter
-- imports. Domain/usecase code never sees these types.

-- name: CreateUser :one
INSERT INTO users (email, password_hash, name, role, subscription_tier)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: GetUserByID :one
SELECT * FROM users
WHERE id = $1 AND deleted_at IS NULL;

-- name: GetUsersByIDs :many
SELECT * FROM users
WHERE id = ANY(sqlc.arg(ids)::uuid[]) AND deleted_at IS NULL;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 AND deleted_at IS NULL;

-- name: UpdateSubscriptionTier :one
UPDATE users
SET subscription_tier = $2, updated_at = now()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: GetProfile :one
SELECT * FROM user_profiles
WHERE user_id = $1;

-- name: UpsertProfile :one
INSERT INTO user_profiles (user_id, risk_tolerance, experience_level, preferred_markets, onboarded)
VALUES ($1, $2, $3, $4, $5)
ON CONFLICT (user_id) DO UPDATE
SET risk_tolerance    = EXCLUDED.risk_tolerance,
    experience_level  = EXCLUDED.experience_level,
    preferred_markets = EXCLUDED.preferred_markets,
    onboarded         = EXCLUDED.onboarded,
    updated_at        = now()
RETURNING *;

-- name: StoreRefreshToken :one
INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetRefreshTokenByHash :one
SELECT * FROM refresh_tokens
WHERE token_hash = $1;

-- name: RevokeRefreshToken :execrows
UPDATE refresh_tokens
SET revoked_at = now()
WHERE token_hash = $1 AND revoked_at IS NULL;

-- name: RevokeAllRefreshTokensForUser :exec
UPDATE refresh_tokens
SET revoked_at = now()
WHERE user_id = $1 AND revoked_at IS NULL;
