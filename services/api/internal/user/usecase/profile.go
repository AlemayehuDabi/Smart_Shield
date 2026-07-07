package usecase

import (
	"context"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// ProfileService serves user + profile reads and onboarding-quiz updates.
type ProfileService struct {
	users domain.UserRepository
}

// NewProfileService wires the profile usecase.
func NewProfileService(users domain.UserRepository) *ProfileService {
	return &ProfileService{users: users}
}

// GetUser returns the account by id.
func (s *ProfileService) GetUser(ctx context.Context, id string) (*domain.User, error) {
	return s.users.GetUserByID(ctx, id)
}

// GetUsersByIDs batch-loads users; used by the Trade.user dataloader.
func (s *ProfileService) GetUsersByIDs(ctx context.Context, ids []string) ([]*domain.User, error) {
	return s.users.GetUsersByIDs(ctx, ids)
}

// GetProfile returns the user's profile, synthesizing an empty (not-yet-onboarded)
// profile when none exists — the client always gets a usable shape.
func (s *ProfileService) GetProfile(ctx context.Context, userID string) (*domain.Profile, error) {
	p, err := s.users.GetProfile(ctx, userID)
	if err != nil {
		if apperror.CodeOf(err) == apperror.CodeNotFound {
			return &domain.Profile{UserID: userID, PreferredMarkets: []string{}, Onboarded: false}, nil
		}
		return nil, err
	}
	return p, nil
}

// UpdateProfile applies onboarding-quiz answers. nil fields are left unchanged.
// Onboarded flips true once both risk tolerance and experience level are known.
func (s *ProfileService) UpdateProfile(ctx context.Context, userID string, in domain.UpdateProfileInput) (*domain.Profile, error) {
	if in.RiskTolerance != nil && !in.RiskTolerance.Valid() {
		return nil, apperror.InvalidInput("invalid risk tolerance")
	}
	if in.ExperienceLevel != nil && !in.ExperienceLevel.Valid() {
		return nil, apperror.InvalidInput("invalid experience level")
	}

	current, err := s.GetProfile(ctx, userID)
	if err != nil {
		return nil, err
	}

	if in.RiskTolerance != nil {
		current.RiskTolerance = in.RiskTolerance
	}
	if in.ExperienceLevel != nil {
		current.ExperienceLevel = in.ExperienceLevel
	}
	if in.PreferredMarkets != nil {
		current.PreferredMarkets = *in.PreferredMarkets
	}
	current.Onboarded = current.RiskTolerance != nil && current.ExperienceLevel != nil

	return s.users.UpsertProfile(ctx, current)
}
