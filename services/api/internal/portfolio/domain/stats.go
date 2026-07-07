package domain

import "github.com/shopspring/decimal"

// JournalStats are aggregate statistics over a set of trades.
type JournalStats struct {
	TotalTrades      int
	OpenTrades       int
	ClosedTrades     int
	Wins             int
	Losses           int
	WinRate          decimal.Decimal // percent, 0..100, over closed trades
	TotalRealizedPnL decimal.Decimal
	AvgReturnPct     decimal.Decimal // mean ReturnPct over closed trades
	AvgWin           decimal.Decimal // mean P&L of winning trades
	AvgLoss          decimal.Decimal // mean P&L of losing trades (negative)
	ProfitFactor     decimal.Decimal // gross profit / gross loss (0 if no losses)
}

// PnLByGroup is realized P&L bucketed by some key (asset class, sector, period).
type PnLByGroup struct {
	Key         string
	Trades      int
	RealizedPnL decimal.Decimal
}

// ExposureSlice is open-position notional for a key, plus its share of the total.
type ExposureSlice struct {
	Key      string
	Notional decimal.Decimal
	Pct      decimal.Decimal // 0..100 of total open notional
}

// Period selects a bucketing granularity for time-series P&L.
type Period string

const (
	PeriodDay   Period = "day"
	PeriodWeek  Period = "week"
	PeriodMonth Period = "month"
)

// Valid reports whether p is a known period.
func (p Period) Valid() bool {
	switch p {
	case PeriodDay, PeriodWeek, PeriodMonth:
		return true
	default:
		return false
	}
}

// PortfolioSummary is the full aggregation returned to the journal/portfolio views.
type PortfolioSummary struct {
	Stats        JournalStats
	PnLByAsset   []PnLByGroup
	PnLBySector  []PnLByGroup
	Exposure     []ExposureSlice
	NetExposure  decimal.Decimal // long open notional minus short open notional
	GrossExposure decimal.Decimal // long + short open notional
}
