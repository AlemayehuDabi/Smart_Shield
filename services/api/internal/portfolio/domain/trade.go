// Package domain holds the portfolio & trade-journal bounded context: the Trade
// aggregate, computed statistics value objects, and the repository port. It is
// framework-free and does not import the user module — a trade only references a
// user by opaque id.
package domain

import (
	"time"

	"github.com/shopspring/decimal"
)

// Side is the direction of a position.
type Side string

const (
	SideLong  Side = "long"
	SideShort Side = "short"
)

// Valid reports whether s is a known side.
func (s Side) Valid() bool { return s == SideLong || s == SideShort }

// AssetClass groups instruments for exposure/P&L breakdowns.
type AssetClass string

const (
	AssetEquity    AssetClass = "equity"
	AssetETF       AssetClass = "etf"
	AssetCrypto    AssetClass = "crypto"
	AssetForex     AssetClass = "forex"
	AssetCommodity AssetClass = "commodity"
	AssetOption    AssetClass = "option"
	AssetOther     AssetClass = "other"
)

// Valid reports whether a is a known asset class.
func (a AssetClass) Valid() bool {
	switch a {
	case AssetEquity, AssetETF, AssetCrypto, AssetForex, AssetCommodity, AssetOption, AssetOther:
		return true
	default:
		return false
	}
}

// Trade is a single manually-journaled trade. An open position has ExitPrice nil.
type Trade struct {
	ID         string
	UserID     string
	Symbol     string
	AssetClass AssetClass
	Sector     *string
	Side       Side
	Quantity   decimal.Decimal
	EntryPrice decimal.Decimal
	ExitPrice  *decimal.Decimal
	Fees       decimal.Decimal
	EntryAt    time.Time
	ExitAt     *time.Time
	Notes      *string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// IsClosed reports whether the position has an exit price (realized).
func (t Trade) IsClosed() bool { return t.ExitPrice != nil }

// Notional is the capital deployed at entry (entry price * quantity).
func (t Trade) Notional() decimal.Decimal { return t.EntryPrice.Mul(t.Quantity) }

// RealizedPnL returns the net P&L for a closed trade (net of fees). The bool is
// false for open positions.
//
//	long:  (exit - entry) * qty - fees
//	short: (entry - exit) * qty - fees
func (t Trade) RealizedPnL() (decimal.Decimal, bool) {
	if !t.IsClosed() {
		return decimal.Zero, false
	}
	var gross decimal.Decimal
	switch t.Side {
	case SideShort:
		gross = t.EntryPrice.Sub(*t.ExitPrice)
	default:
		gross = t.ExitPrice.Sub(t.EntryPrice)
	}
	return gross.Mul(t.Quantity).Sub(t.Fees), true
}

// ReturnPct returns realized P&L as a percentage of entry notional. False for
// open positions or zero-notional trades.
func (t Trade) ReturnPct() (decimal.Decimal, bool) {
	pnl, ok := t.RealizedPnL()
	if !ok {
		return decimal.Zero, false
	}
	notional := t.Notional()
	if notional.IsZero() {
		return decimal.Zero, false
	}
	return pnl.Div(notional).Mul(decimal.NewFromInt(100)), true
}

// --- usecase input value objects ---------------------------------------------

// CreateTradeInput is the data required to journal a trade.
type CreateTradeInput struct {
	Symbol     string
	AssetClass AssetClass
	Sector     *string
	Side       Side
	Quantity   decimal.Decimal
	EntryPrice decimal.Decimal
	ExitPrice  *decimal.Decimal
	Fees       *decimal.Decimal
	EntryAt    time.Time
	ExitAt     *time.Time
	Notes      *string
}

// UpdateTradeInput carries optional edits; nil means "leave unchanged". Note the
// MVP cannot re-open a closed trade by clearing ExitPrice — documented tradeoff.
type UpdateTradeInput struct {
	Symbol     *string
	AssetClass *AssetClass
	Sector     *string
	Side       *Side
	Quantity   *decimal.Decimal
	EntryPrice *decimal.Decimal
	ExitPrice  *decimal.Decimal
	Fees       *decimal.Decimal
	EntryAt    *time.Time
	ExitAt     *time.Time
	Notes      *string
}

// TradeFilter narrows a trade listing.
type TradeFilter struct {
	Symbol     *string
	AssetClass *AssetClass
	OpenOnly   bool
	From       *time.Time
	To         *time.Time
	Limit      int32
	Offset     int32
}
