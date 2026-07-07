package resolver

import (
	"context"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/dataloader"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/model"
)

// --- Mutation -----------------------------------------------------------------

// CreateTrade journals a new trade for the caller.
func (r *mutationResolver) CreateTrade(ctx context.Context, input model.CreateTradeInput) (*model.Trade, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	t, err := r.Trades.Create(ctx, uid, toDomainCreateTrade(input))
	if err != nil {
		return nil, err
	}
	return mapTrade(t), nil
}

// UpdateTrade edits an owned trade.
func (r *mutationResolver) UpdateTrade(ctx context.Context, id string, input model.UpdateTradeInput) (*model.Trade, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	t, err := r.Trades.Update(ctx, uid, id, toDomainUpdateTrade(input))
	if err != nil {
		return nil, err
	}
	return mapTrade(t), nil
}

// DeleteTrade soft-deletes an owned trade.
func (r *mutationResolver) DeleteTrade(ctx context.Context, id string) (bool, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return false, err
	}
	if err := r.Trades.Delete(ctx, uid, id); err != nil {
		return false, err
	}
	return true, nil
}

// --- Query --------------------------------------------------------------------

// Trades lists the caller's trades.
func (r *queryResolver) Trades(ctx context.Context, filter *model.TradeFilter) ([]*model.Trade, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	ts, err := r.Trades.List(ctx, uid, toDomainTradeFilter(filter))
	if err != nil {
		return nil, err
	}
	return mapTrades(ts), nil
}

// Trade returns a single owned trade.
func (r *queryResolver) Trade(ctx context.Context, id string) (*model.Trade, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	t, err := r.Trades.Get(ctx, uid, id)
	if err != nil {
		return nil, err
	}
	return mapTrade(t), nil
}

// PortfolioSummary returns the full aggregation for the caller.
func (r *queryResolver) PortfolioSummary(ctx context.Context) (*model.PortfolioSummary, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	s, err := r.Analytics.Summary(ctx, uid)
	if err != nil {
		return nil, err
	}
	return mapSummary(s), nil
}

// JournalStats returns aggregate journal statistics for the caller.
func (r *queryResolver) JournalStats(ctx context.Context) (*model.JournalStats, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	st, err := r.Analytics.Stats(ctx, uid)
	if err != nil {
		return nil, err
	}
	return mapStats(st), nil
}

// --- Trade field resolvers ----------------------------------------------------

// User resolves a trade's owner via the per-request dataloader (N+1 guard).
func (r *tradeResolver) User(ctx context.Context, obj *model.Trade) (*model.User, error) {
	u, err := dataloader.LoadUser(ctx, obj.UserID)
	if err != nil {
		return nil, err
	}
	return mapUser(u), nil
}
