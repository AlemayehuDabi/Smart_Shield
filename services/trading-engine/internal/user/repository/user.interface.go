import (
	"github.com/AlemayehuDabi/Smart_Sheild/services/trading-engine/internal/user/model"
)


type UserInterface interface {
	Create(user *model.UserModel) error,
	FindByEmail(email string) (*model.UserModel, error),
	GetUserByID(id string) (*model.UserModel, error),
	Update(userId string, input model.UserModel) (*model.UserModel, error)
}