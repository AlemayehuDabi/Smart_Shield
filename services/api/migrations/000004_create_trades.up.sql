CREATE TYPE trade_side AS ENUM ('long', 'short');
CREATE TYPE asset_class AS ENUM ('equity', 'etf', 'crypto', 'forex', 'commodity', 'option', 'other');

CREATE TABLE trades (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    symbol       TEXT NOT NULL,
    asset_class  asset_class NOT NULL DEFAULT 'equity',
    sector       TEXT,
    side         trade_side NOT NULL DEFAULT 'long',
    quantity     NUMERIC(24, 8) NOT NULL CHECK (quantity > 0),
    entry_price  NUMERIC(24, 8) NOT NULL CHECK (entry_price >= 0),
    exit_price   NUMERIC(24, 8) CHECK (exit_price >= 0),   -- NULL => position still open
    fees         NUMERIC(24, 8) NOT NULL DEFAULT 0 CHECK (fees >= 0),
    entry_at     TIMESTAMPTZ NOT NULL,
    exit_at      TIMESTAMPTZ,
    notes        TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_trades_user_id ON trades (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trades_user_symbol ON trades (user_id, symbol) WHERE deleted_at IS NULL;
