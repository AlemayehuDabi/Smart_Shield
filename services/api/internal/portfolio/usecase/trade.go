// Package usecase holds portfolio & trade-journal business logic. Depends only
// on the domain port + shared apperror. All operations are user-scoped: a caller
// can only see or mutate their own trades.
package usecase

import (
	"context"
	"strings"

	"github.com/shopspring/decimal"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
)

// TradeService implements CRUD over journaled trades.
type TradeService struct {
	trades domain.TradeRepository
}

// NewTradeService wires the trade usecase.
func NewTradeService(trades domain.TradeRepository) *TradeService {
	return &TradeService{trades: trades}
}

// Create validates and journals a new trade for userID.
func (s *TradeService) Create(ctx context.Context, userID string, in domain.CreateTradeInput) (*domain.Trade, error) {
	if err := validateCore(in.Symbol, in.Side, in.AssetClass, in.Quantity, in.EntryPrice, in.ExitPrice, in.Fees); err != nil {
		return nil, err
	}
	fees := decimal.Zero
	if in.Fees != nil {
		fees = *in.Fees
	}
	assetClass := in.AssetClass
	if assetClass == "" {
		assetClass = domain.AssetEquity
	}
	t := &domain.Trade{
		UserID:     userID,
		Symbol:     strings.ToUpper(strings.TrimSpace(in.Symbol)),
		AssetClass: assetClass,
		Sector:     in.Sector,
		Side:       in.Side,
		Quantity:   in.Quantity,
		EntryPrice: in.EntryPrice,
		ExitPrice:  in.ExitPrice,
		Fees:       fees,
		EntryAt:    in.EntryAt,
		ExitAt:     in.ExitAt,
		Notes:      in.Notes,
	}
	if err := s.trades.Create(ctx, t); err != nil {
		return nil, err
	}
	return t, nil
}

// Get returns a single owned trade (NotFound if missing or owned by someone else).
func (s *TradeService) Get(ctx context.Context, userID, id string) (*domain.Trade, error) {
	t, err := s.trades.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if t.UserID != userID {
		return nil, apperror.NotFound("trade not found")
	}
	return t, nil
}

// List returns the caller's trades matching the filter.
func (s *TradeService) List(ctx context.Context, userID string, f domain.TradeFilter) ([]*domain.Trade, error) {
	return s.trades.ListByUser(ctx, userID, f)
}

// Update applies a partial edit to an owned trade.
func (s *TradeService) Update(ctx context.Context, userID, id string, in domain.UpdateTradeInput) (*domain.Trade, error) {
	t, err := s.Get(ctx, userID, id)
	if err != nil {
		return nil, err
	}

	if in.Symbol != nil {
		t.Symbol = strings.ToUpper(strings.TrimSpace(*in.Symbol))
	}
	if in.AssetClass != nil {
		t.AssetClass = *in.AssetClass
	}
	if in.Sector != nil {
		t.Sector = in.Sector
	}
	if in.Side != nil {
		t.Side = *in.Side
	}
	if in.Quantity != nil {
		t.Quantity = *in.Quantity
	}
	if in.EntryPrice != nil {
		t.EntryPrice = *in.EntryPrice
	}
	if in.ExitPrice != nil {
		t.ExitPrice = in.ExitPrice
	}
	if in.Fees != nil {
		t.Fees = *in.Fees
	}
	if in.EntryAt != nil {
		t.EntryAt = *in.EntryAt
	}
	if in.ExitAt != nil {
		t.ExitAt = in.ExitAt
	}
	if in.Notes != nil {
		t.Notes = in.Notes
	}

	if err := validateCore(t.Symbol, t.Side, t.AssetClass, t.Quantity, t.EntryPrice, t.ExitPrice, t.Fees); err != nil {
		return nil, err
	}
	if err := s.trades.Update(ctx, t); err != nil {
		return nil, err
	}
	return t, nil
}

// Delete soft-deletes an owned trade.
func (s *TradeService) Delete(ctx context.Context, userID, id string) error {
	if _, err := s.Get(ctx, userID, id); err != nil {
		return err
	}
	return s.trades.SoftDelete(ctx, id)
}

// validateCore enforces the invariants shared by create and update.
func validateCore(symbol string, side domain.Side, ac domain.AssetClass, qty, entry decimal.Decimal, exit *decimal.Decimal, fees decimal.Decimal) error {
	if strings.TrimSpace(symbol) == "" {
		return apperror.InvalidInput("symbol is required")
	}
	if !side.Valid() {
		return apperror.InvalidInput("invalid trade side")
	}
	if ac != "" && !ac.Valid() {
		return apperror.InvalidInput("invalid asset class")
	}
	if !qty.IsPositive() {
		return apperror.InvalidInput("quantity must be greater than zero")
	}
	if entry.IsNegative() {
		return apperror.InvalidInput("entry price cannot be negative")
	}
	if exit != nil && exit.IsNegative() {
		return apperror.InvalidInput("exit price cannot be negative")
	}
	if fees.IsNegative() {
		return apperror.InvalidInput("fees cannot be negative")
	}
	return nil
}
