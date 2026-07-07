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
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/testcontainers/testcontainers-go"
	tcpostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
	pg "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/repository/postgres"
)

// migrationsDir resolves /migrations relative to this test file.
func migrationsDir(t *testing.T) string {
	t.Helper()
	_, file, _, ok := runtime.Caller(0)
	require.True(t, ok)
	return filepath.Join(filepath.Dir(file), "..", "..", "..", "..", "migrations")
}

// newTestPool spins up a throwaway Postgres, applies migrations, and returns a pool.
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

func TestIntegration_UserRepo(t *testing.T) {
	ctx := context.Background()
	pool := newTestPool(t)
	repo := pg.NewUserRepo(pool)

	u := &domain.User{
		Email:            "ada@example.com",
		Name:             "Ada",
		PasswordHash:     "hash",
		Role:             domain.RoleUser,
		SubscriptionTier: domain.TierFree,
	}
	require.NoError(t, repo.CreateUser(ctx, u))
	require.NotEmpty(t, u.ID, "id should be back-filled")

	// Duplicate email => Conflict.
	dup := &domain.User{Email: "ada@example.com", PasswordHash: "x", Role: domain.RoleUser, SubscriptionTier: domain.TierFree}
	err := repo.CreateUser(ctx, dup)
	require.Error(t, err)
	assert.Equal(t, apperror.CodeConflict, apperror.CodeOf(err))

	// Read back by id and email.
	got, err := repo.GetUserByID(ctx, u.ID)
	require.NoError(t, err)
	assert.Equal(t, "ada@example.com", got.Email)

	byEmail, err := repo.GetUserByEmail(ctx, "ada@example.com")
	require.NoError(t, err)
	assert.Equal(t, u.ID, byEmail.ID)

	// Missing => NotFound.
	_, err = repo.GetUserByEmail(ctx, "ghost@example.com")
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))

	// Subscription tier update.
	upgraded, err := repo.UpdateSubscriptionTier(ctx, u.ID, domain.TierPro)
	require.NoError(t, err)
	assert.Equal(t, domain.TierPro, upgraded.SubscriptionTier)

	// Profile upsert (insert then update).
	risk := domain.RiskModerate
	p, err := repo.UpsertProfile(ctx, &domain.Profile{UserID: u.ID, RiskTolerance: &risk, PreferredMarkets: []string{"US", "CRYPTO"}, Onboarded: true})
	require.NoError(t, err)
	assert.True(t, p.Onboarded)
	assert.Equal(t, []string{"US", "CRYPTO"}, p.PreferredMarkets)

	// Batch load.
	users, err := repo.GetUsersByIDs(ctx, []string{u.ID, "00000000-0000-0000-0000-000000000000"})
	require.NoError(t, err)
	assert.Len(t, users, 1)
}

func TestIntegration_RefreshTokenRepo(t *testing.T) {
	ctx := context.Background()
	pool := newTestPool(t)
	userRepo := pg.NewUserRepo(pool)
	tokenRepo := pg.NewRefreshTokenRepo(pool)

	u := &domain.User{Email: "t@example.com", PasswordHash: "h", Role: domain.RoleUser, SubscriptionTier: domain.TierFree}
	require.NoError(t, userRepo.CreateUser(ctx, u))

	rt := &domain.RefreshToken{UserID: u.ID, TokenHash: "abc123", ExpiresAt: time.Now().Add(time.Hour)}
	require.NoError(t, tokenRepo.Store(ctx, rt))
	require.NotEmpty(t, rt.ID)

	got, err := tokenRepo.GetByHash(ctx, "abc123")
	require.NoError(t, err)
	assert.True(t, got.IsActive(time.Now()))

	require.NoError(t, tokenRepo.Revoke(ctx, "abc123"))
	revoked, err := tokenRepo.GetByHash(ctx, "abc123")
	require.NoError(t, err)
	assert.False(t, revoked.IsActive(time.Now()), "token should be inactive after revoke")

	// Revoking again => NotFound (already revoked).
	err = tokenRepo.Revoke(ctx, "abc123")
	assert.Equal(t, apperror.CodeNotFound, apperror.CodeOf(err))
}
