package repository

import (
	"context"
	"errors"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/model"
	"gorm.io/gorm"
)

type userRepo struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) Create(ctx context.Context, user *domain.User) error {
	userModel := &model.UserModel{
		ID:       user.ID,
		Email:    user.Email,
		Password: user.Password,
		Name:     user.Name,
		Role:     model.Role(user.Role),
	}
	if err := r.db.WithContext(ctx).Create(userModel).Error; err != nil {
		return err
	}
	user.ID = userModel.ID
	return nil
}

func (r *userRepo) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var u model.UserModel
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&u).Error
	if err != nil {
		return nil, err
	}
	return toDomain(&u), nil
}

func (r *userRepo) GetByID(ctx context.Context, id string) (*domain.User, error) {
	var u model.UserModel
	err := r.db.WithContext(ctx).Where("id = ?", id).First(&u).Error
	if err != nil {
		return nil, err
	}
	return toDomain(&u), nil
}

func (r *userRepo) Update(ctx context.Context, userID string, input domain.UpdateUserInput) (*domain.User, error) {
	var user model.UserModel
	if err := r.db.WithContext(ctx).First(&user, "id = ?", userID).Error; err != nil {
		return nil, err
	}

	updates := map[string]interface{}{}
	if input.Name != nil {
		updates["name"] = *input.Name
	}
	if input.Email != nil {
		updates["email"] = *input.Email
	}

	if len(updates) == 0 {
		return nil, errors.New("no fields to update")
	}

	if err := r.db.WithContext(ctx).Model(&user).Updates(updates).Error; err != nil {
		return nil, err
	}

	return toDomain(&user), nil
}

func toDomain(u *model.UserModel) *domain.User {
	return &domain.User{
		ID:       u.ID,
		Email:    u.Email,
		Name:     u.Name,
		Role:     domain.Role(u.Role),
		Password: u.Password,
	}
}
