package usecase

import (
	"context"
	"sort"

	"github.com/shopspring/decimal"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
)

var hundred = decimal.NewFromInt(100)

// AnalyticsService computes portfolio/journal statistics in pure Go over the
// caller's trades. No AI/Python call is involved for the MVP.
type AnalyticsService struct {
	trades domain.TradeRepository
}

// NewAnalyticsService wires the analytics usecase.
func NewAnalyticsService(trades domain.TradeRepository) *AnalyticsService {
	return &AnalyticsService{trades: trades}
}

// Summary loads the caller's trades and aggregates them.
func (s *AnalyticsService) Summary(ctx context.Context, userID string) (*domain.PortfolioSummary, error) {
	trades, err := s.trades.ListByUser(ctx, userID, domain.TradeFilter{})
	if err != nil {
		return nil, err
	}
	return ComputeSummary(trades), nil
}

// Stats loads the caller's trades and returns just the journal stats.
func (s *AnalyticsService) Stats(ctx context.Context, userID string) (domain.JournalStats, error) {
	trades, err := s.trades.ListByUser(ctx, userID, domain.TradeFilter{})
	if err != nil {
		return domain.JournalStats{}, err
	}
	return computeStats(trades), nil
}

// ComputeSummary is a pure function (no I/O) so it is trivially unit-testable.
func ComputeSummary(trades []*domain.Trade) *domain.PortfolioSummary {
	return &domain.PortfolioSummary{
		Stats:         computeStats(trades),
		PnLByAsset:    pnlByAsset(trades),
		PnLBySector:   pnlBySector(trades),
		Exposure:      exposureByAsset(trades),
		NetExposure:   netExposure(trades),
		GrossExposure: grossExposure(trades),
	}
}

func computeStats(trades []*domain.Trade) domain.JournalStats {
	var (
		open, closed, wins, losses int
		totalPnL, sumReturnPct     = decimal.Zero, decimal.Zero
		grossProfit, grossLoss     = decimal.Zero, decimal.Zero
	)

	for _, t := range trades {
		pnl, ok := t.RealizedPnL()
		if !ok {
			open++
			continue
		}
		closed++
		totalPnL = totalPnL.Add(pnl)
		if rp, ok := t.ReturnPct(); ok {
			sumReturnPct = sumReturnPct.Add(rp)
		}
		switch pnl.Sign() {
		case 1:
			wins++
			grossProfit = grossProfit.Add(pnl)
		case -1:
			losses++
			grossLoss = grossLoss.Add(pnl.Abs())
		}
	}

	stats := domain.JournalStats{
		TotalTrades:      len(trades),
		OpenTrades:       open,
		ClosedTrades:     closed,
		Wins:             wins,
		Losses:           losses,
		TotalRealizedPnL: totalPnL,
	}
	if closed > 0 {
		closedDec := decimal.NewFromInt(int64(closed))
		stats.WinRate = decimal.NewFromInt(int64(wins)).Div(closedDec).Mul(hundred).Round(2)
		stats.AvgReturnPct = sumReturnPct.Div(closedDec).Round(2)
	}
	if wins > 0 {
		stats.AvgWin = grossProfit.Div(decimal.NewFromInt(int64(wins))).Round(2)
	}
	if losses > 0 {
		stats.AvgLoss = grossLoss.Div(decimal.NewFromInt(int64(losses))).Neg().Round(2)
	}
	if grossLoss.IsPositive() {
		stats.ProfitFactor = grossProfit.Div(grossLoss).Round(2)
	}
	return stats
}

func pnlByAsset(trades []*domain.Trade) []domain.PnLByGroup {
	return groupPnL(trades, func(t *domain.Trade) string { return string(t.AssetClass) })
}

func pnlBySector(trades []*domain.Trade) []domain.PnLByGroup {
	return groupPnL(trades, func(t *domain.Trade) string {
		if t.Sector == nil || *t.Sector == "" {
			return "unclassified"
		}
		return *t.Sector
	})
}

// groupPnL buckets realized P&L of closed trades by keyFn, sorted by key.
func groupPnL(trades []*domain.Trade, keyFn func(*domain.Trade) string) []domain.PnLByGroup {
	pnlByKey := map[string]decimal.Decimal{}
	countByKey := map[string]int{}
	for _, t := range trades {
		pnl, ok := t.RealizedPnL()
		if !ok {
			continue
		}
		k := keyFn(t)
		pnlByKey[k] = getOrZero(pnlByKey, k).Add(pnl)
		countByKey[k]++
	}
	out := make([]domain.PnLByGroup, 0, len(pnlByKey))
	for k, v := range pnlByKey {
		out = append(out, domain.PnLByGroup{Key: k, Trades: countByKey[k], RealizedPnL: v})
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Key < out[j].Key })
	return out
}

// exposureByAsset computes open-position notional per asset class + its share.
func exposureByAsset(trades []*domain.Trade) []domain.ExposureSlice {
	notionalByKey := map[string]decimal.Decimal{}
	total := decimal.Zero
	for _, t := range trades {
		if t.IsClosed() {
			continue
		}
		k := string(t.AssetClass)
		n := t.Notional()
		notionalByKey[k] = getOrZero(notionalByKey, k).Add(n)
		total = total.Add(n)
	}
	out := make([]domain.ExposureSlice, 0, len(notionalByKey))
	for k, n := range notionalByKey {
		slice := domain.ExposureSlice{Key: k, Notional: n}
		if total.IsPositive() {
			slice.Pct = n.Div(total).Mul(hundred).Round(2)
		}
		out = append(out, slice)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Key < out[j].Key })
	return out
}

func netExposure(trades []*domain.Trade) decimal.Decimal {
	net := decimal.Zero
	for _, t := range trades {
		if t.IsClosed() {
			continue
		}
		if t.Side == domain.SideShort {
			net = net.Sub(t.Notional())
		} else {
			net = net.Add(t.Notional())
		}
	}
	return net
}

func grossExposure(trades []*domain.Trade) decimal.Decimal {
	gross := decimal.Zero
	for _, t := range trades {
		if !t.IsClosed() {
			gross = gross.Add(t.Notional())
		}
	}
	return gross
}

func getOrZero(m map[string]decimal.Decimal, k string) decimal.Decimal {
	if v, ok := m[k]; ok {
		return v
	}
	return decimal.Zero
}
