// Package postgres implements the portfolio module's TradeRepository on top of
// the sqlc-generated `db` package. Only this file knows pgx/SQL/decimal-null
// details; the layers above speak pure domain.
package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/repository/postgres/db"
)

// TradeRepo implements domain.TradeRepository.
type TradeRepo struct {
	q *db.Queries
}

// NewTradeRepo builds the repository from the shared pool.
func NewTradeRepo(pool *pgxpool.Pool) *TradeRepo {
	return &TradeRepo{q: db.New(pool)}
}

var _ domain.TradeRepository = (*TradeRepo)(nil)

// Create inserts a trade and back-fills generated fields onto t.
func (r *TradeRepo) Create(ctx context.Context, t *domain.Trade) error {
	uid, err := uuid.Parse(t.UserID)
	if err != nil {
		return apperror.InvalidInput("invalid user id")
	}
	row, err := r.q.CreateTrade(ctx, db.CreateTradeParams{
		UserID:     uid,
		Symbol:     t.Symbol,
		AssetClass: db.AssetClass(t.AssetClass),
		Sector:     t.Sector,
		Side:       db.TradeSide(t.Side),
		Quantity:   t.Quantity,
		EntryPrice: t.EntryPrice,
		ExitPrice:  toNullDecimal(t.ExitPrice),
		Fees:       t.Fees,
		EntryAt:    t.EntryAt,
		ExitAt:     t.ExitAt,
		Notes:      t.Notes,
	})
	if err != nil {
		if isForeignKeyViolation(err) {
			return apperror.NotFound("user not found")
		}
		return apperror.Internal(err)
	}
	*t = *toDomainTrade(row)
	return nil
}

// GetByID returns a trade or apperror.NotFound (ownership is enforced upstream).
func (r *TradeRepo) GetByID(ctx context.Context, id string) (*domain.Trade, error) {
	tid, err := uuid.Parse(id)
	if err != nil {
		return nil, apperror.NotFound("trade not found")
	}
	row, err := r.q.GetTradeByID(ctx, tid)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperror.NotFound("trade not found")
		}
		return nil, apperror.Internal(err)
	}
	return toDomainTrade(row), nil
}

// Update writes the full trade back and returns the stored row.
func (r *TradeRepo) Update(ctx context.Context, t *domain.Trade) error {
	tid, err := uuid.Parse(t.ID)
	if err != nil {
		return apperror.NotFound("trade not found")
	}
	row, err := r.q.UpdateTrade(ctx, db.UpdateTradeParams{
		ID:         tid,
		Symbol:     t.Symbol,
		AssetClass: db.AssetClass(t.AssetClass),
		Sector:     t.Sector,
		Side:       db.TradeSide(t.Side),
		Quantity:   t.Quantity,
		EntryPrice: t.EntryPrice,
		ExitPrice:  toNullDecimal(t.ExitPrice),
		Fees:       t.Fees,
		EntryAt:    t.EntryAt,
		ExitAt:     t.ExitAt,
		Notes:      t.Notes,
	})
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return apperror.NotFound("trade not found")
		}
		return apperror.Internal(err)
	}
	*t = *toDomainTrade(row)
	return nil
}

// SoftDelete marks a trade deleted. NotFound if nothing was updated.
func (r *TradeRepo) SoftDelete(ctx context.Context, id string) error {
	tid, err := uuid.Parse(id)
	if err != nil {
		return apperror.NotFound("trade not found")
	}
	n, err := r.q.SoftDeleteTrade(ctx, tid)
	if err != nil {
		return apperror.Internal(err)
	}
	if n == 0 {
		return apperror.NotFound("trade not found")
	}
	return nil
}

// ListByUser returns the caller's trades matching the filter.
func (r *TradeRepo) ListByUser(ctx context.Context, userID string, f domain.TradeFilter) ([]*domain.Trade, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperror.InvalidInput("invalid user id")
	}
	rows, err := r.q.ListTradesByUser(ctx, db.ListTradesByUserParams{
		UserID:     uid,
		Symbol:     f.Symbol,
		AssetClass: toDBAssetPtr(f.AssetClass),
		OpenOnly:   f.OpenOnly,
		FromTs:     f.From,
		ToTs:       f.To,
		RowLimit:   f.Limit,
		RowOffset:  f.Offset,
	})
	if err != nil {
		return nil, apperror.Internal(err)
	}
	out := make([]*domain.Trade, len(rows))
	for i := range rows {
		out[i] = toDomainTrade(rows[i])
	}
	return out, nil
}

// --- mapping helpers ----------------------------------------------------------

func toDomainTrade(t db.Trade) *domain.Trade {
	return &domain.Trade{
		ID:         t.ID.String(),
		UserID:     t.UserID.String(),
		Symbol:     t.Symbol,
		AssetClass: domain.AssetClass(t.AssetClass),
		Sector:     t.Sector,
		Side:       domain.Side(t.Side),
		Quantity:   t.Quantity,
		EntryPrice: t.EntryPrice,
		ExitPrice:  fromNullDecimal(t.ExitPrice),
		Fees:       t.Fees,
		EntryAt:    t.EntryAt,
		ExitAt:     t.ExitAt,
		Notes:      t.Notes,
		CreatedAt:  t.CreatedAt,
		UpdatedAt:  t.UpdatedAt,
	}
}

func toDBAssetPtr(a *domain.AssetClass) *db.AssetClass {
	if a == nil {
		return nil
	}
	v := db.AssetClass(*a)
	return &v
}

func toNullDecimal(d *decimal.Decimal) decimal.NullDecimal {
	if d == nil {
		return decimal.NullDecimal{}
	}
	return decimal.NullDecimal{Decimal: *d, Valid: true}
}

func fromNullDecimal(nd decimal.NullDecimal) *decimal.Decimal {
	if !nd.Valid {
		return nil
	}
	d := nd.Decimal
	return &d
}
