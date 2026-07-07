package usecase_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/usecase"
)

func newAuthService() (*usecase.AuthService, *mockUserRepo, *mockRefreshRepo) {
	users := newMockUserRepo()
	refresh := newMockRefreshRepo()
	svc := usecase.NewAuthService(users, refresh, fakeHasher{}, &fakeIssuer{})
	return svc, users, refresh
}

func TestAuthService_Register(t *testing.T) {
	tests := []struct {
		name     string
		input    domain.RegisterInput
		seed     func(*mockUserRepo)
		wantCode apperror.Code
	}{
		{
			name:  "valid registration",
			input: domain.RegisterInput{Name: "Ada", Email: "Ada@Example.com", Password: "supersecret"},
		},
		{
			name:     "missing name",
			input:    domain.RegisterInput{Name: "  ", Email: "a@b.com", Password: "supersecret"},
			wantCode: apperror.CodeInvalidInput,
		},
		{
			name:     "invalid email",
			input:    domain.RegisterInput{Name: "Ada", Email: "not-an-email", Password: "supersecret"},
			wantCode: apperror.CodeInvalidInput,
		},
		{
			name:     "short password",
			input:    domain.RegisterInput{Name: "Ada", Email: "a@b.com", Password: "short"},
			wantCode: apperror.CodeInvalidInput,
		},
		{
			name:  "duplicate email",
			input: domain.RegisterInput{Name: "Ada", Email: "dup@b.com", Password: "supersecret"},
			seed: func(m *mockUserRepo) {
				m.byEmail["dup@b.com"] = &domain.User{ID: "x", Email: "dup@b.com"}
			},
			wantCode: apperror.CodeConflict,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			svc, users, refresh := newAuthService()
			if tt.seed != nil {
				tt.seed(users)
			}

			res, err := svc.Register(context.Background(), tt.input)

			if tt.wantCode != "" {
				require.Error(t, err)
				assert.Equal(t, tt.wantCode, apperror.CodeOf(err))
				return
			}
			require.NoError(t, err)
			require.NotNil(t, res)
			assert.NotEmpty(t, res.User.ID)
			assert.Equal(t, "ada@example.com", res.User.Email, "email should be normalized")
			assert.Equal(t, domain.TierFree, res.User.SubscriptionTier)
			assert.Equal(t, "hashed:supersecret", res.User.PasswordHash)
			assert.NotEmpty(t, res.Tokens.AccessToken)
			assert.NotEmpty(t, res.Tokens.RefreshToken)
			// A refresh token must have been persisted (hashed).
			_, ok := refresh.byHash["rhash:"+res.Tokens.RefreshToken]
			assert.True(t, ok, "refresh token should be stored by hash")
		})
	}
}

func TestAuthService_Login(t *testing.T) {
	ctx := context.Background()
	svc, users, _ := newAuthService()
	// Seed a user with a known hash.
	users.users["u1"] = &domain.User{ID: "u1", Email: "a@b.com", PasswordHash: "hashed:supersecret", SubscriptionTier: domain.TierFree}
	users.byEmail["a@b.com"] = users.users["u1"]

	tests := []struct {
		name     string
		input    domain.LoginInput
		wantCode apperror.Code
	}{
		{name: "valid login", input: domain.LoginInput{Email: "A@B.com", Password: "supersecret"}},
		{name: "wrong password", input: domain.LoginInput{Email: "a@b.com", Password: "nope"}, wantCode: apperror.CodeUnauthorized},
		{name: "unknown user", input: domain.LoginInput{Email: "ghost@b.com", Password: "supersecret"}, wantCode: apperror.CodeUnauthorized},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			res, err := svc.Login(ctx, tt.input)
			if tt.wantCode != "" {
				require.Error(t, err)
				assert.Equal(t, tt.wantCode, apperror.CodeOf(err))
				return
			}
			require.NoError(t, err)
			assert.Equal(t, "u1", res.User.ID)
			assert.NotEmpty(t, res.Tokens.RefreshToken)
		})
	}
}

func TestAuthService_Refresh_RotatesAndRejectsReuse(t *testing.T) {
	ctx := context.Background()
	svc, users, _ := newAuthService()
	users.users["u1"] = &domain.User{ID: "u1", Email: "a@b.com"}

	// Obtain an initial refresh token via login.
	users.byEmail["a@b.com"] = users.users["u1"]
	users.users["u1"].PasswordHash = "hashed:supersecret"
	first, err := svc.Login(ctx, domain.LoginInput{Email: "a@b.com", Password: "supersecret"})
	require.NoError(t, err)

	// Refresh rotates: returns a new token.
	rotated, err := svc.Refresh(ctx, first.Tokens.RefreshToken)
	require.NoError(t, err)
	assert.NotEqual(t, first.Tokens.RefreshToken, rotated.Tokens.RefreshToken)

	// Reusing the original (now revoked) token must fail.
	_, err = svc.Refresh(ctx, first.Tokens.RefreshToken)
	require.Error(t, err)
	assert.Equal(t, apperror.CodeUnauthorized, apperror.CodeOf(err))
}
