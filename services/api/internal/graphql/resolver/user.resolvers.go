package resolver

import (
	"context"
	"strings"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/graphql/model"
	userdomain "github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// --- Mutation -----------------------------------------------------------------

// Register is the resolver for the register mutation.
func (r *mutationResolver) Register(ctx context.Context, input model.RegisterInput) (*model.AuthPayload, error) {
	res, err := r.Auth.Register(ctx, userdomain.RegisterInput{
		Name:     input.Name,
		Email:    input.Email,
		Password: input.Password,
	})
	if err != nil {
		return nil, err
	}
	return mapAuthPayload(res), nil
}

// Login is the resolver for the login mutation.
func (r *mutationResolver) Login(ctx context.Context, input model.LoginInput) (*model.AuthPayload, error) {
	res, err := r.Auth.Login(ctx, userdomain.LoginInput{Email: input.Email, Password: input.Password})
	if err != nil {
		return nil, err
	}
	return mapAuthPayload(res), nil
}

// RefreshToken rotates a refresh token into a fresh access+refresh pair.
func (r *mutationResolver) RefreshToken(ctx context.Context, refreshToken string) (*model.AuthPayload, error) {
	res, err := r.Auth.Refresh(ctx, refreshToken)
	if err != nil {
		return nil, err
	}
	return mapAuthPayload(res), nil
}

// Logout revokes the presented refresh token.
func (r *mutationResolver) Logout(ctx context.Context, refreshToken string) (bool, error) {
	if err := r.Auth.Logout(ctx, refreshToken); err != nil {
		return false, err
	}
	return true, nil
}

// UpdateProfile applies onboarding-quiz answers for the caller.
func (r *mutationResolver) UpdateProfile(ctx context.Context, input model.UpdateProfileInput) (*model.Profile, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	p, err := r.Users.UpdateProfile(ctx, uid, toDomainUpdateProfile(input))
	if err != nil {
		return nil, err
	}
	return mapProfile(p), nil
}

// ChangeSubscriptionTier starts a (stubbed) plan change for the caller.
func (r *mutationResolver) ChangeSubscriptionTier(ctx context.Context, tier model.SubscriptionTier) (*model.SubscriptionChangePayload, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	res, err := r.Subscription.ChangeTier(ctx, uid, userdomain.SubscriptionTier(strings.ToLower(string(tier))))
	if err != nil {
		return nil, err
	}
	return &model.SubscriptionChangePayload{CheckoutURL: res.CheckoutURL, User: mapUser(res.User)}, nil
}

// --- Query --------------------------------------------------------------------

// Me returns the authenticated user.
func (r *queryResolver) Me(ctx context.Context) (*model.User, error) {
	uid, err := userIDFromCtx(ctx)
	if err != nil {
		return nil, err
	}
	u, err := r.Users.GetUser(ctx, uid)
	if err != nil {
		return nil, err
	}
	return mapUser(u), nil
}

// User returns a user by id.
func (r *queryResolver) User(ctx context.Context, id string) (*model.User, error) {
	u, err := r.Users.GetUser(ctx, id)
	if err != nil {
		return nil, err
	}
	return mapUser(u), nil
}

// --- User field resolvers -----------------------------------------------------

// Profile lazily resolves a user's onboarding profile.
func (r *userResolver) Profile(ctx context.Context, obj *model.User) (*model.Profile, error) {
	p, err := r.Users.GetProfile(ctx, obj.ID)
	if err != nil {
		return nil, err
	}
	return mapProfile(p), nil
}
