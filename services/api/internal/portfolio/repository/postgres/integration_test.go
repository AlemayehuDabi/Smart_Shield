package postgres_test

import (
	"context"
	"path/filepath"
	"runtime"
	"testing"
	"time"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/domain"
	pg "github.com/AlemayehuDabi/smart-shield/services/api/internal/portfolio/repository/postgres"
)

func migrationsDir(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	require.True(t, ok)
	return filepath.Join(filepath.Dir(file), "..", "..", "..", "..", "migrations")
}

func newTestPool(t *testing.T) *pgxpool.Pool {
	t.Helper()
	if testing.Short() {
		t.Skip("skipping integration test in -short mode")
	}
	ctx := context.Background()

	container, err := tcpostgres.Run(ctx, "postgres:16-alpine",
		tcpostgres.WithDatabase("smartshield"),
		tcpostgres.WithUsername("test"),
		tcpostgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForListeningPort("5432/tcp").WithStartupTimeout(90*time.Second),
		),
	)
	require.NoError(t, err)
	t.Cleanup(func() { _ = container.Terminate(ctx) })

	dsn, err := container.ConnectionString(ctx, "sslmode=disable")
	require.NoError(t, err)

	m, err := migrate.New("file://"+migrationsDir(t), dsn)
	require.NoError(t, err)
	require.NoError(t, m.Up())

	pool, err := pgxpool.New(ctx, dsn)
	require.NoError(t, err)
	t.Cleanup(pool.Close)
	return pool
}

// seedUser inserts a user row directly (portfolio tests only need a valid FK).
func seedUser(t *testing.T, pool *pgxpool.Pool) string {
	t.Helper()
	var id string
	err := pool.QueryRow(context.Background(),
		`INSERT INTO users (email, password_hash, name) VALUES ($1, 'h', 'Trader') RETURNING id`,
		"trader@example.com",
	).Scan(&id)
	require.NoError(t, err)
	return id
}

func TestIntegration_TradeRepo(t *testing.T) {
	ctx := context.Background()
	pool := newTestPool(t)
	userID := seedUser(t, pool)
	repo := pg.NewTradeRepo(pool)

	exit := decimal.RequireFromString("110")
	tr := &domain.Trade{
		UserID:     userID,
		Symbol:     "AAPL",
		AssetClass: domain.AssetEquity,
		Side:       domain.SideLong,
		Quantity:   decimal.RequireFromString("10"),
		EntryPrice: decimal.RequireFromString("100"),
		ExitPrice:  &exit,
		Fees:       decimal.RequireFromString("1"),
		EntryAt:    time.Now(),
	}
	require.NoError(t, repo.Create(ctx, tr))
	require.NotEmpty(t, tr.ID)

	// Read back; decimals round-trip.
	got, err := repo.GetByID(ctx, tr.ID)
	require.NoError(t, err)
	assert.True(t, got.EntryPrice.Equal(decimal.RequireFromString("100")))
	require.NotNil(t, got.ExitPrice)
	assert.True(t, got.ExitPrice.Equal(exit))
	pnl, ok := got.RealizedPnL()
	require.True(t, ok)
	assert.True(t, pnl.Equal(decimal.RequireFromString("99")), "pnl = (110-100)*10 - 1 fee")

	// Open position via update (note: MVP keeps exit set; here we change quantity).
	newQty := decimal.RequireFromString("20")
	got.Quantity = newQty
	require.NoError(t, repo.Update(ctx, got))
	reread, err := repo.GetByID(ctx, tr.ID)
	require.NoError(t, err)
	assert.True(t, reread.Quantity.Equal(newQty))

	// Filtered list.
	list, err := repo.ListByUser(ctx, userID, domain.TradeFilter{})
	require.NoError(t, err)
	assert.Len(t, list, 1)

	// Soft delete then confirm gone.
	require.NoError(t, repo.SoftDelete(ctx, tr.ID))
	_, err = repo.GetByID(ctx, tr.ID)
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))

	// Deleting again => NotFound.
	err = repo.SoftDelete(ctx, tr.ID)
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))
}
