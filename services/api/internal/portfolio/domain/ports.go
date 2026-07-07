package domain

import "context"

// TradeRepository persists trades. Implemented in
// internal/portfolio/repository/postgres. All reads are user-scoped by the
// usecase; the repo returns apperror.NotFound for missing/foreign rows.
type TradeRepository interface {
	Create(ctx context.Context, t *Trade) error
	GetByID(ctx context.Context, id string) (*Trade, error)
	Update(ctx context.Context, t *Trade) error
	SoftDelete(ctx context.Context, id string) error
	ListByUser(ctx context.Context, userID string, f TradeFilter) ([]*Trade, error)
}
