package usecase

import (
	"context"
	"errors"

	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/domain"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/pkg/apperrors"
	"gorm.io/gorm"
)

type userUsecase struct {
	repo domain.UserRepository
}

func NewUserUsecase(repo domain.UserRepository) domain.UserUsecase {
	return &userUsecase{repo: repo}
}

func (u *userUsecase) GetUserProfile(ctx context.Context, id string) (*domain.User, error) {
	user, err := u.repo.GetByID(ctx, id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NewNotFound("user not found")
		}
		return nil, apperrors.NewInternal(err.Error())
	}
	return user, nil
}

func (u *userUsecase) UpdateUserProfile(ctx context.Context, userID string, input domain.UpdateUserInput) (*domain.User, error) {
	user, err := u.repo.Update(ctx, userID, input)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, apperrors.NewNotFound("user not found")
		}
		return nil, apperrors.NewInternal(err.Error())
	}
	return user, nil
}
