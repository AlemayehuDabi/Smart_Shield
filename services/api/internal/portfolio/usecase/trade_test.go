package usecase_test

import (
	"context"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/usecase"
)

// mockTradeRepo is an in-memory fake implementing domain.TradeRepository.
type mockTradeRepo struct {
	trades map[string]*domain.Trade
	seq    int
}

func newMockTradeRepo() *mockTradeRepo {
	return &mockTradeRepo{trades: map[string]*domain.Trade{}}
}

func (m *mockTradeRepo) Create(_ context.Context, t *domain.Trade) error {
	m.seq++
	t.ID = itoa(m.seq)
	t.CreatedAt = time.Now()
	t.UpdatedAt = t.CreatedAt
	cp := *t
	m.trades[t.ID] = &cp
	return nil
}

func (m *mockTradeRepo) GetByID(_ context.Context, id string) (*domain.Trade, error) {
	if t, ok := m.trades[id]; ok {
		cp := *t
		return &cp, nil
	}
	return nil, apperror.NotFound("trade not found")
}

func (m *mockTradeRepo) Update(_ context.Context, t *domain.Trade) error {
	if _, ok := m.trades[t.ID]; !ok {
		return apperror.NotFound("trade not found")
	}
	cp := *t
	m.trades[t.ID] = &cp
	return nil
}

func (m *mockTradeRepo) SoftDelete(_ context.Context, id string) error {
	if _, ok := m.trades[id]; !ok {
		return apperror.NotFound("trade not found")
	}
	delete(m.trades, id)
	return nil
}

func (m *mockTradeRepo) ListByUser(_ context.Context, userID string, _ domain.TradeFilter) ([]*domain.Trade, error) {
	var out []*domain.Trade
	for _, t := range m.trades {
		if t.UserID == userID {
			cp := *t
			out = append(out, &cp)
		}
	}
	return out, nil
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	var b []byte
	for n > 0 {
		b = append([]byte{byte('0' + n%10)}, b...)
		n /= 10
	}
	return string(b)
}

func validCreateInput() domain.CreateTradeInput {
	return domain.CreateTradeInput{
		Symbol:     "aapl",
		AssetClass: domain.AssetEquity,
		Side:       domain.SideLong,
		Quantity:   d("10"),
		EntryPrice: d("150"),
		EntryAt:    time.Now(),
	}
}

func TestTradeService_Create_Validation(t *testing.T) {
	tests := []struct {
		name     string
		mutate   func(*domain.CreateTradeInput)
		wantCode apperror.Code
	}{
		{name: "valid"},
		{name: "empty symbol", mutate: func(in *domain.CreateTradeInput) { in.Symbol = " " }, wantCode: apperror.CodeInvalidInput},
		{name: "zero quantity", mutate: func(in *domain.CreateTradeInput) { in.Quantity = d("0") }, wantCode: apperror.CodeInvalidInput},
		{name: "negative entry", mutate: func(in *domain.CreateTradeInput) { in.EntryPrice = d("-1") }, wantCode: apperror.CodeInvalidInput},
		{name: "bad side", mutate: func(in *domain.CreateTradeInput) { in.Side = "sideways" }, wantCode: apperror.CodeInvalidInput},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			svc := usecase.NewTradeService(newMockTradeRepo())
			in := validCreateInput()
			if tt.mutate != nil {
				tt.mutate(&in)
			}
			got, err := svc.Create(context.Background(), "user-1", in)
			if tt.wantCode != "" {
				require.Error(t, err)
				assert.Equal(t, tt.wantCode, apperror.CodeOf(err))
				return
			}
			require.NoError(t, err)
			assert.Equal(t, "AAPL", got.Symbol, "symbol should be upper-cased")
			assert.Equal(t, "user-1", got.UserID)
		})
	}
}

func TestTradeService_OwnershipEnforced(t *testing.T) {
	ctx := context.Background()
	repo := newMockTradeRepo()
	svc := usecase.NewTradeService(repo)

	owned, err := svc.Create(ctx, "owner", validCreateInput())
	require.NoError(t, err)

	// A different user cannot read, update, or delete the trade.
	_, err = svc.Get(ctx, "intruder", owned.ID)
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))

	_, err = svc.Update(ctx, "intruder", owned.ID, domain.UpdateTradeInput{})
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))

	err = svc.Delete(ctx, "intruder", owned.ID)
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))

	// The owner can.
	err = svc.Delete(ctx, "owner", owned.ID)
	assert.NoError(t, err)
}
