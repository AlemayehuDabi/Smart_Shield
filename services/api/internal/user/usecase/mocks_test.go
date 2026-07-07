package usecase_test

import (
	"context"
	"time"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/user/domain"
)

// mockUserRepo is a hand-written in-memory fake implementing domain.UserRepository.
// Hand-written fakes keep the tests readable and dependency-free (no mock codegen).
type mockUserRepo struct {
	users      map[string]*domain.User // by id
	byEmail    map[string]*domain.User
	profiles   map[string]*domain.Profile
	nextID     int
	createErr  error
	createUser func(u *domain.User) error
}

func newMockUserRepo() *mockUserRepo {
	return &mockUserRepo{
		users:    map[string]*domain.User{},
		byEmail:  map[string]*domain.User{},
		profiles: map[string]*domain.Profile{},
	}
}

func (m *mockUserRepo) CreateUser(_ context.Context, u *domain.User) error {
	if m.createUser != nil {
		return m.createUser(u)
	}
	if m.createErr != nil {
		return m.createErr
	}
	if _, exists := m.byEmail[u.Email]; exists {
		return apperror.Conflict("email already registered")
	}
	m.nextID++
	u.ID = time.Now().Format("20060102") + "-" + itoa(m.nextID)
	u.CreatedAt = time.Now()
	u.UpdatedAt = u.CreatedAt
	cp := *u
	m.users[u.ID] = &cp
	m.byEmail[u.Email] = &cp
	return nil
}

func (m *mockUserRepo) GetUserByID(_ context.Context, id string) (*domain.User, error) {
	if u, ok := m.users[id]; ok {
		cp := *u
		return &cp, nil
	}
	return nil, apperror.NotFound("user not found")
}

func (m *mockUserRepo) GetUsersByIDs(_ context.Context, ids []string) ([]*domain.User, error) {
	var out []*domain.User
	for _, id := range ids {
		if u, ok := m.users[id]; ok {
			cp := *u
			out = append(out, &cp)
		}
	}
	return out, nil
}

func (m *mockUserRepo) GetUserByEmail(_ context.Context, email string) (*domain.User, error) {
	if u, ok := m.byEmail[email]; ok {
		cp := *u
		return &cp, nil
	}
	return nil, apperror.NotFound("user not found")
}

func (m *mockUserRepo) UpdateSubscriptionTier(_ context.Context, userID string, tier domain.SubscriptionTier) (*domain.User, error) {
	u, ok := m.users[userID]
	if !ok {
		return nil, apperror.NotFound("user not found")
	}
	u.SubscriptionTier = tier
	cp := *u
	return &cp, nil
}

func (m *mockUserRepo) GetProfile(_ context.Context, userID string) (*domain.Profile, error) {
	if p, ok := m.profiles[userID]; ok {
		cp := *p
		return &cp, nil
	}
	return nil, apperror.NotFound("profile not found")
}

func (m *mockUserRepo) UpsertProfile(_ context.Context, p *domain.Profile) (*domain.Profile, error) {
	cp := *p
	m.profiles[p.UserID] = &cp
	out := cp
	return &out, nil
}

// mockRefreshRepo is an in-memory fake implementing domain.RefreshTokenRepository.
type mockRefreshRepo struct {
	byHash map[string]*domain.RefreshToken
}

func newMockRefreshRepo() *mockRefreshRepo {
	return &mockRefreshRepo{byHash: map[string]*domain.RefreshToken{}}
}

func (m *mockRefreshRepo) Store(_ context.Context, rt *domain.RefreshToken) error {
	rt.ID = "rt-" + itoa(len(m.byHash)+1)
	rt.CreatedAt = time.Now()
	cp := *rt
	m.byHash[rt.TokenHash] = &cp
	return nil
}

func (m *mockRefreshRepo) GetByHash(_ context.Context, hash string) (*domain.RefreshToken, error) {
	if rt, ok := m.byHash[hash]; ok {
		cp := *rt
		return &cp, nil
	}
	return nil, apperror.NotFound("refresh token not found")
}

func (m *mockRefreshRepo) Revoke(_ context.Context, hash string) error {
	rt, ok := m.byHash[hash]
	if !ok {
		return apperror.NotFound("refresh token not found")
	}
	now := time.Now()
	rt.RevokedAt = &now
	return nil
}

func (m *mockRefreshRepo) RevokeAllForUser(_ context.Context, userID string) error {
	now := time.Now()
	for _, rt := range m.byHash {
		if rt.UserID == userID {
			rt.RevokedAt = &now
		}
	}
	return nil
}

// fakeHasher is a trivial reversible "hasher" for deterministic tests.
type fakeHasher struct{}

func (fakeHasher) Hash(plain string) (string, error) { return "hashed:" + plain, nil }
func (fakeHasher) Compare(plain, hash string) bool    { return hash == "hashed:"+plain }

// fakeIssuer issues predictable, unique tokens (counter makes rotation testable).
type fakeIssuer struct{ n int }

func (f *fakeIssuer) IssueAccessToken(userID string) (string, time.Time, error) {
	return "access-" + userID, time.Now().Add(time.Minute), nil
}
func (f *fakeIssuer) GenerateRefreshToken() (string, error) {
	f.n++
	return "refresh-" + itoa(f.n), nil
}
func (f *fakeIssuer) HashRefreshToken(raw string) string { return "rhash:" + raw }
func (f *fakeIssuer) RefreshTTL() time.Duration          { return time.Hour }

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
