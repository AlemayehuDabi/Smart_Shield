package resolver

import (
	"strings"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/model"
	portdomain "github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
	userdomain "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// This file is the ONLY translation layer between domain types and the
// gqlgen-generated GraphQL models. Resolvers stay thin because all shape/enum
// conversion lives here. Our domain enums are lowercase and the GraphQL enums
// are uppercase but otherwise identical spellings, so case folding is a safe,
// centralized conversion.

// --- user module --------------------------------------------------------------

func mapUser(u *userdomain.User) *model.User {
	if u == nil {
		return nil
	}
	return &model.User{
		ID:               u.ID,
		Email:            u.Email,
		Name:             u.Name,
		Role:             model.UserRole(strings.ToUpper(string(u.Role))),
		SubscriptionTier: model.SubscriptionTier(strings.ToUpper(string(u.SubscriptionTier))),
		CreatedAt:        u.CreatedAt,
		UpdatedAt:        u.UpdatedAt,
	}
}

func mapProfile(p *userdomain.Profile) *model.Profile {
	if p == nil {
		return nil
	}
	markets := p.PreferredMarkets
	if markets == nil {
		markets = []string{}
	}
	return &model.Profile{
		RiskTolerance:    mapRiskPtrToModel(p.RiskTolerance),
		ExperienceLevel:  mapExpPtrToModel(p.ExperienceLevel),
		PreferredMarkets: markets,
		Onboarded:        p.Onboarded,
	}
}

func mapAuthPayload(res *userdomain.AuthResult) *model.AuthPayload {
	if res == nil {
		return nil
	}
	return &model.AuthPayload{
		AccessToken:          res.Tokens.AccessToken,
		RefreshToken:         res.Tokens.RefreshToken,
		AccessTokenExpiresAt: res.Tokens.AccessTokenExpiresAt,
		User:                 mapUser(res.User),
	}
}

func mapRiskPtrToModel(r *userdomain.RiskTolerance) *model.RiskTolerance {
	if r == nil {
		return nil
	}
	v := model.RiskTolerance(strings.ToUpper(string(*r)))
	return &v
}

func mapExpPtrToModel(e *userdomain.ExperienceLevel) *model.ExperienceLevel {
	if e == nil {
		return nil
	}
	v := model.ExperienceLevel(strings.ToUpper(string(*e)))
	return &v
}

func toDomainUpdateProfile(in model.UpdateProfileInput) userdomain.UpdateProfileInput {
	var out userdomain.UpdateProfileInput
	// gqlgen models a nullable list as []string (nil when the field is omitted);
	// the domain uses *[]string to distinguish "unset" from "set to empty".
	if in.PreferredMarkets != nil {
		markets := in.PreferredMarkets
		out.PreferredMarkets = &markets
	}
	if in.RiskTolerance != nil {
		v := userdomain.RiskTolerance(strings.ToLower(string(*in.RiskTolerance)))
		out.RiskTolerance = &v
	}
	if in.ExperienceLevel != nil {
		v := userdomain.ExperienceLevel(strings.ToLower(string(*in.ExperienceLevel)))
		out.ExperienceLevel = &v
	}
	return out
}

// --- portfolio module ---------------------------------------------------------

func mapTrade(t *portdomain.Trade) *model.Trade {
	if t == nil {
		return nil
	}
	m := &model.Trade{
		ID:         t.ID,
		UserID:     t.UserID,
		Symbol:     t.Symbol,
		AssetClass: model.AssetClass(strings.ToUpper(string(t.AssetClass))),
		Sector:     t.Sector,
		Side:       model.TradeSide(strings.ToUpper(string(t.Side))),
		Quantity:   t.Quantity,
		EntryPrice: t.EntryPrice,
		ExitPrice:  t.ExitPrice,
		Fees:       t.Fees,
		EntryAt:    t.EntryAt,
		ExitAt:     t.ExitAt,
		Notes:      t.Notes,
		IsClosed:   t.IsClosed(),
		CreatedAt:  t.CreatedAt,
		UpdatedAt:  t.UpdatedAt,
	}
	if pnl, ok := t.RealizedPnL(); ok {
		m.RealizedPnl = &pnl
	}
	if rp, ok := t.ReturnPct(); ok {
		m.ReturnPct = &rp
	}
	return m
}

func mapTrades(ts []*portdomain.Trade) []*model.Trade {
	out := make([]*model.Trade, len(ts))
	for i, t := range ts {
		out[i] = mapTrade(t)
	}
	return out
}

func mapStats(s portdomain.JournalStats) *model.JournalStats {
	return &model.JournalStats{
		TotalTrades:      s.TotalTrades,
		OpenTrades:       s.OpenTrades,
		ClosedTrades:     s.ClosedTrades,
		Wins:             s.Wins,
		Losses:           s.Losses,
		WinRate:          s.WinRate,
		TotalRealizedPnl: s.TotalRealizedPnL,
		AvgReturnPct:     s.AvgReturnPct,
		AvgWin:           s.AvgWin,
		AvgLoss:          s.AvgLoss,
		ProfitFactor:     s.ProfitFactor,
	}
}

func mapSummary(s *portdomain.PortfolioSummary) *model.PortfolioSummary {
	if s == nil {
		return nil
	}
	return &model.PortfolioSummary{
		Stats:         mapStats(s.Stats),
		PnlByAsset:    mapGroups(s.PnLByAsset),
		PnlBySector:   mapGroups(s.PnLBySector),
		Exposure:      mapExposure(s.Exposure),
		NetExposure:   s.NetExposure,
		GrossExposure: s.GrossExposure,
	}
}

func mapGroups(gs []portdomain.PnLByGroup) []*model.PnlByGroup {
	out := make([]*model.PnlByGroup, len(gs))
	for i, g := range gs {
		out[i] = &model.PnlByGroup{Key: g.Key, Trades: g.Trades, RealizedPnl: g.RealizedPnl}
	}
	return out
}

func mapExposure(es []portdomain.ExposureSlice) []*model.ExposureSlice {
	out := make([]*model.ExposureSlice, len(es))
	for i, e := range es {
		out[i] = &model.ExposureSlice{Key: e.Key, Notional: e.Notional, Pct: e.Pct}
	}
	return out
}

func toDomainCreateTrade(in model.CreateTradeInput) portdomain.CreateTradeInput {
	return portdomain.CreateTradeInput{
		Symbol:     in.Symbol,
		AssetClass: portdomain.AssetClass(strings.ToLower(string(in.AssetClass))),
		Sector:     in.Sector,
		Side:       portdomain.Side(strings.ToLower(string(in.Side))),
		Quantity:   in.Quantity,
		EntryPrice: in.EntryPrice,
		ExitPrice:  in.ExitPrice,
		Fees:       in.Fees,
		EntryAt:    in.EntryAt,
		ExitAt:     in.ExitAt,
		Notes:      in.Notes,
	}
}

func toDomainUpdateTrade(in model.UpdateTradeInput) portdomain.UpdateTradeInput {
	out := portdomain.UpdateTradeInput{
		Symbol:     in.Symbol,
		Sector:     in.Sector,
		Quantity:   in.Quantity,
		EntryPrice: in.EntryPrice,
		ExitPrice:  in.ExitPrice,
		Fees:       in.Fees,
		EntryAt:    in.EntryAt,
		ExitAt:     in.ExitAt,
		Notes:      in.Notes,
	}
	if in.AssetClass != nil {
		v := portdomain.AssetClass(strings.ToLower(string(*in.AssetClass)))
		out.AssetClass = &v
	}
	if in.Side != nil {
		v := portdomain.Side(strings.ToLower(string(*in.Side)))
		out.Side = &v
	}
	return out
}

func toDomainTradeFilter(in *model.TradeFilter) portdomain.TradeFilter {
	var f portdomain.TradeFilter
	if in == nil {
		return f
	}
	f.Symbol = in.Symbol
	f.From = in.From
	f.To = in.To
	if in.AssetClass != nil {
		v := portdomain.AssetClass(strings.ToLower(string(*in.AssetClass)))
		f.AssetClass = &v
	}
	if in.OpenOnly != nil {
		f.OpenOnly = *in.OpenOnly
	}
	if in.Limit != nil {
		f.Limit = int32(*in.Limit)
	}
	if in.Offset != nil {
		f.Offset = int32(*in.Offset)
	}
	return f
}
