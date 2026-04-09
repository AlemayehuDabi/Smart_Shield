package service


import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/repository"
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/dto"
	
)


type UserService struct {
	repo *repository.UserRepository
}


func (s *UserService) GetUserProfile(id string) (*domain.User, error) {
	user, err := s.repo.GetUserByID(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	converted := pkg.ToDomain(user)

	fmt.Println(converted)

	return converted, nil
}

func (s *UserService) UpdateUserProfile(userId string, input dto.UpdateUserProfile) (*domain.User, error ){
	user, err := s.repo.UpdateUserInput(userId, input)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("user not found")
		}

		
		return nil, err
	}

	converted := pkg.ToDomain(user)
	return converted, nil
}