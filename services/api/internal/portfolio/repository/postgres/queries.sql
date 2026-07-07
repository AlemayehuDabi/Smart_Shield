-- name: CreateTrade :one
INSERT INTO trades (
    user_id, symbol, asset_class, sector, side,
    quantity, entry_price, exit_price, fees, entry_at, exit_at, notes
) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
)
RETURNING *;

-- name: GetTradeByID :one
SELECT * FROM trades
WHERE id = $1 AND deleted_at IS NULL;

-- name: UpdateTrade :one
UPDATE trades SET
    symbol      = $2,
    asset_class = $3,
    sector      = $4,
    side        = $5,
    quantity    = $6,
    entry_price = $7,
    exit_price  = $8,
    fees        = $9,
    entry_at    = $10,
    exit_at     = $11,
    notes       = $12,
    updated_at  = now()
WHERE id = $1 AND deleted_at IS NULL
RETURNING *;

-- name: SoftDeleteTrade :execrows
UPDATE trades SET deleted_at = now()
WHERE id = $1 AND deleted_at IS NULL;

-- name: ListTradesByUser :many
-- Optional filters use the NULL-guard idiom so a single static query handles
-- every combination — this is how sqlc supports "dynamic" filtering.
SELECT * FROM trades
WHERE user_id = $1
  AND deleted_at IS NULL
  AND (sqlc.narg(symbol)::text IS NULL OR symbol = sqlc.narg(symbol))
  AND (sqlc.narg(asset_class)::asset_class IS NULL OR asset_class = sqlc.narg(asset_class))
  AND (NOT sqlc.arg(open_only)::bool OR exit_price IS NULL)
  AND (sqlc.narg(from_ts)::timestamptz IS NULL OR entry_at >= sqlc.narg(from_ts))
  AND (sqlc.narg(to_ts)::timestamptz IS NULL OR entry_at <= sqlc.narg(to_ts))
ORDER BY entry_at DESC
LIMIT NULLIF(sqlc.arg(row_limit)::int, 0)
OFFSET sqlc.arg(row_offset)::int;
