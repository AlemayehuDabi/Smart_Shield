package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/repository/postgres/db"
)

// RefreshTokenRepo implements domain.RefreshTokenRepository.
type RefreshTokenRepo struct {
	q *db.Queries
}

// NewRefreshTokenRepo builds the repository from the shared pool.
func NewRefreshTokenRepo(pool *pgxpool.Pool) *RefreshTokenRepo {
	return &RefreshTokenRepo{q: db.New(pool)}
}

var _ domain.RefreshTokenRepository = (*RefreshTokenRepo)(nil)

// Store inserts a hashed refresh token and back-fills generated fields.
func (r *RefreshTokenRepo) Store(ctx context.Context, rt *domain.RefreshToken) error {
	uid, err := uuid.Parse(rt.UserID)
	if err != nil {
		return apperror.NotFound("user not found")
	}
	row, err := r.q.StoreRefreshToken(ctx, db.StoreRefreshTokenParams{
		UserID:    uid,
		TokenHash: rt.TokenHash,
		ExpiresAt: rt.ExpiresAt,
	})
	if err != nil {
		return apperror.Internal(err)
	}
	*rt = *toDomainRefreshToken(row)
	return nil
}

// GetByHash returns a stored token or apperror.NotFound.
func (r *RefreshTokenRepo) GetByHash(ctx context.Context, tokenHash string) (*domain.RefreshToken, error) {
	row, err := r.q.GetRefreshTokenByHash(ctx, tokenHash)
	if err != nil {
		return nil, mapReadErr(err, "refresh token not found")
	}
	return toDomainRefreshToken(row), nil
}

// Revoke marks a single token revoked. Returns NotFound if nothing was updated.
func (r *RefreshTokenRepo) Revoke(ctx context.Context, tokenHash string) error {
	n, err := r.q.RevokeRefreshToken(ctx, tokenHash)
	if err != nil {
		return apperror.Internal(err)
	}
	if n == 0 {
		return apperror.NotFound("refresh token not found")
	}
	return nil
}

// RevokeAllForUser revokes every active token for a user (e.g. "log out everywhere").
func (r *RefreshTokenRepo) RevokeAllForUser(ctx context.Context, userID string) error {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return apperror.NotFound("user not found")
	}
	if err := r.q.RevokeAllRefreshTokensForUser(ctx, uid); err != nil {
		return apperror.Internal(err)
	}
	return nil
}

func toDomainRefreshToken(t db.RefreshToken) *domain.RefreshToken {
	return &domain.RefreshToken{
		ID:        t.ID.String(),
		UserID:    t.UserID.String(),
		TokenHash: t.TokenHash,
		ExpiresAt: t.ExpiresAt,
		RevokedAt: t.RevokedAt,
		CreatedAt: t.CreatedAt,
	}
}
