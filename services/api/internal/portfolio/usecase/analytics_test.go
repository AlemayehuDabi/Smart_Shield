package usecase_test

import (
	"testing"
	"time"

	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/usecase"
)

func d(s string) decimal.Decimal { return decimal.RequireFromString(s) }

func dp(s string) *decimal.Decimal { v := d(s); return &v }

// trade is a compact constructor for tests.
func trade(side domain.Side, ac domain.AssetClass, qty, entry string, exit *decimal.Decimal) *domain.Trade {
	return &domain.Trade{
		Side:       side,
		AssetClass: ac,
		Quantity:   d(qty),
		EntryPrice: d(entry),
		ExitPrice:  exit,
		Fees:       decimal.Zero,
		EntryAt:    time.Now(),
	}
}

func TestComputeStats(t *testing.T) {
	trades := []*domain.Trade{
		trade(domain.SideLong, domain.AssetEquity, "10", "100", dp("110")),  // +100, +10%
		trade(domain.SideLong, domain.AssetEquity, "5", "100", dp("90")),    // -50, -10%
		trade(domain.SideShort, domain.AssetCrypto, "2", "50", dp("40")),    // +20, +20%
		trade(domain.SideLong, domain.AssetEquity, "1", "200", nil),         // open
	}

	stats := usecase.ComputeSummary(trades).Stats

	assert.Equal(t, 4, stats.TotalTrades)
	assert.Equal(t, 3, stats.ClosedTrades)
	assert.Equal(t, 1, stats.OpenTrades)
	assert.Equal(t, 2, stats.Wins)
	assert.Equal(t, 1, stats.Losses)
	assertDec(t, "66.67", stats.WinRate)
	assertDec(t, "70", stats.TotalRealizedPnL)
	assertDec(t, "6.67", stats.AvgReturnPct)
	assertDec(t, "60", stats.AvgWin)
	assertDec(t, "-50", stats.AvgLoss)
	assertDec(t, "2.4", stats.ProfitFactor)
}

func TestComputeStats_EmptyAndAllOpen(t *testing.T) {
	tests := []struct {
		name   string
		trades []*domain.Trade
	}{
		{name: "empty", trades: nil},
		{name: "all open", trades: []*domain.Trade{trade(domain.SideLong, domain.AssetEquity, "1", "10", nil)}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			stats := usecase.ComputeSummary(tt.trades).Stats
			// No closed trades => zero-value ratios, no division panics.
			assertDec(t, "0", stats.WinRate)
			assertDec(t, "0", stats.ProfitFactor)
			assertDec(t, "0", stats.TotalRealizedPnL)
		})
	}
}

func TestComputeSummary_ExposureAndPnLGroups(t *testing.T) {
	trades := []*domain.Trade{
		trade(domain.SideLong, domain.AssetEquity, "10", "100", dp("110")), // closed equity +100
		trade(domain.SideShort, domain.AssetCrypto, "2", "50", dp("40")),   // closed crypto +20
		trade(domain.SideLong, domain.AssetEquity, "1", "200", nil),        // open equity 200 notional
		trade(domain.SideShort, domain.AssetCrypto, "3", "100", nil),       // open crypto 300 notional
	}

	sum := usecase.ComputeSummary(trades)

	// P&L by asset (closed only), sorted by key.
	require.Len(t, sum.PnLByAsset, 2)
	assert.Equal(t, "crypto", sum.PnLByAsset[0].Key)
	assertDec(t, "20", sum.PnLByAsset[0].RealizedPnl)
	assert.Equal(t, "equity", sum.PnLByAsset[1].Key)
	assertDec(t, "100", sum.PnLByAsset[1].RealizedPnl)

	// Exposure (open only): crypto 300, equity 200, total 500.
	require.Len(t, sum.Exposure, 2)
	assert.Equal(t, "crypto", sum.Exposure[0].Key)
	assertDec(t, "300", sum.Exposure[0].Notional)
	assertDec(t, "60", sum.Exposure[0].Pct)
	assertDec(t, "200", sum.Exposure[1].Notional)
	assertDec(t, "40", sum.Exposure[1].Pct)

	// Net = long(200) - short(300) = -100; gross = 500.
	assertDec(t, "-100", sum.NetExposure)
	assertDec(t, "500", sum.GrossExposure)
}

func assertDec(t *testing.T, want string, got decimal.Decimal) {
	t.Helper()
	assert.Truef(t, d(want).Equal(got), "want %s, got %s", want, got.String())
}
