// Package postgres implements the user module's domain repositories on top of
// the sqlc-generated `db` package. It is the ONLY place that knows about pgx,
// SQL, uuid.UUID, or db.* types. Everything above it speaks pure domain.
package postgres

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/repository/postgres/db"
)

// UserRepo implements domain.UserRepository.
type UserRepo struct {
	q *db.Queries
}

// NewUserRepo builds the repository from the shared pool.
func NewUserRepo(pool *pgxpool.Pool) *UserRepo {
	return &UserRepo{q: db.New(pool)}
}

var _ domain.UserRepository = (*UserRepo)(nil)

// CreateUser inserts a user and back-fills generated fields onto u.
func (r *UserRepo) CreateUser(ctx context.Context, u *domain.User) error {
	row, err := r.q.CreateUser(ctx, db.CreateUserParams{
		Email:            u.Email,
		PasswordHash:     u.PasswordHash,
		Name:             u.Name,
		Role:             db.UserRole(u.Role),
		SubscriptionTier: db.SubscriptionTier(u.SubscriptionTier),
	})
	if err != nil {
		return mapUserWriteErr(err)
	}
	*u = *toDomainUser(row)
	return nil
}

// GetUserByID returns a user or apperror.NotFound.
func (r *UserRepo) GetUserByID(ctx context.Context, id string) (*domain.User, error) {
	uid, err := uuid.Parse(id)
	if err != nil {
		return nil, apperror.NotFound("user not found")
	}
	row, err := r.q.GetUserByID(ctx, uid)
	if err != nil {
		return nil, mapReadErr(err, "user not found")
	}
	return toDomainUser(row), nil
}

// GetUsersByIDs batch-loads users for the dataloader. Missing ids are simply
// absent from the result (the loader maps them back to nil).
func (r *UserRepo) GetUsersByIDs(ctx context.Context, ids []string) ([]*domain.User, error) {
	uids := make([]uuid.UUID, 0, len(ids))
	for _, id := range ids {
		if u, err := uuid.Parse(id); err == nil {
			uids = append(uids, u)
		}
	}
	rows, err := r.q.GetUsersByIDs(ctx, uids)
	if err != nil {
		return nil, apperror.Internal(err)
	}
	out := make([]*domain.User, len(rows))
	for i := range rows {
		out[i] = toDomainUser(rows[i])
	}
	return out, nil
}

// GetUserByEmail returns a user or apperror.NotFound.
func (r *UserRepo) GetUserByEmail(ctx context.Context, email string) (*domain.User, error) {
	row, err := r.q.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, mapReadErr(err, "user not found")
	}
	return toDomainUser(row), nil
}

// UpdateSubscriptionTier persists a new tier and returns the updated user.
func (r *UserRepo) UpdateSubscriptionTier(ctx context.Context, userID string, tier domain.SubscriptionTier) (*domain.User, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperror.NotFound("user not found")
	}
	row, err := r.q.UpdateSubscriptionTier(ctx, db.UpdateSubscriptionTierParams{
		ID:               uid,
		SubscriptionTier: db.SubscriptionTier(tier),
	})
	if err != nil {
		return nil, mapReadErr(err, "user not found")
	}
	return toDomainUser(row), nil
}

// GetProfile returns the profile or apperror.NotFound.
func (r *UserRepo) GetProfile(ctx context.Context, userID string) (*domain.Profile, error) {
	uid, err := uuid.Parse(userID)
	if err != nil {
		return nil, apperror.NotFound("profile not found")
	}
	row, err := r.q.GetProfile(ctx, uid)
	if err != nil {
		return nil, mapReadErr(err, "profile not found")
	}
	return toDomainProfile(row), nil
}

// UpsertProfile inserts or updates the profile and returns the stored row.
func (r *UserRepo) UpsertProfile(ctx context.Context, p *domain.Profile) (*domain.Profile, error) {
	uid, err := uuid.Parse(p.UserID)
	if err != nil {
		return nil, apperror.NotFound("user not found")
	}
	markets := p.PreferredMarkets
	if markets == nil {
		markets = []string{}
	}
	row, err := r.q.UpsertProfile(ctx, db.UpsertProfileParams{
		UserID:           uid,
		RiskTolerance:    toDBRisk(p.RiskTolerance),
		ExperienceLevel:  toDBExperience(p.ExperienceLevel),
		PreferredMarkets: markets,
		Onboarded:        p.Onboarded,
	})
	if err != nil {
		return nil, mapUserWriteErr(err)
	}
	return toDomainProfile(row), nil
}

// --- mapping helpers ----------------------------------------------------------

func toDomainUser(u db.User) *domain.User {
	return &domain.User{
		ID:               u.ID.String(),
		Email:            u.Email,
		Name:             u.Name,
		PasswordHash:     u.PasswordHash,
		Role:             domain.Role(u.Role),
		SubscriptionTier: domain.SubscriptionTier(u.SubscriptionTier),
		CreatedAt:        u.CreatedAt,
		UpdatedAt:        u.UpdatedAt,
	}
}

func toDomainProfile(p db.UserProfile) *domain.Profile {
	markets := p.PreferredMarkets
	if markets == nil {
		markets = []string{}
	}
	return &domain.Profile{
		UserID:           p.UserID.String(),
		RiskTolerance:    toDomainRisk(p.RiskTolerance),
		ExperienceLevel:  toDomainExperience(p.ExperienceLevel),
		PreferredMarkets: markets,
		Onboarded:        p.Onboarded,
		CreatedAt:        p.CreatedAt,
		UpdatedAt:        p.UpdatedAt,
	}
}

func toDBRisk(r *domain.RiskTolerance) *db.RiskTolerance {
	if r == nil {
		return nil
	}
	v := db.RiskTolerance(*r)
	return &v
}

func toDomainRisk(r *db.RiskTolerance) *domain.RiskTolerance {
	if r == nil {
		return nil
	}
	v := domain.RiskTolerance(*r)
	return &v
}

func toDBExperience(e *domain.ExperienceLevel) *db.ExperienceLevel {
	if e == nil {
		return nil
	}
	v := db.ExperienceLevel(*e)
	return &v
}

func toDomainExperience(e *db.ExperienceLevel) *domain.ExperienceLevel {
	if e == nil {
		return nil
	}
	v := domain.ExperienceLevel(*e)
	return &v
}

// mapReadErr converts pgx no-rows into a typed NotFound, everything else internal.
func mapReadErr(err error, notFoundMsg string) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return apperror.NotFound(notFoundMsg)
	}
	return apperror.Internal(err)
}

// mapUserWriteErr converts a unique-violation on email into a Conflict.
func mapUserWriteErr(err error) error {
	if isUniqueViolation(err) {
		return apperror.Conflict("email already registered")
	}
	return apperror.Internal(err)
}
