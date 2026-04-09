package dto

type RegisterInput struct {
	Name     string
	Email    string
	Password string
}

type LoginInput struct {
	Email    string
	Password string
}

// AuthResponse is returned by register/login (never send Password on User to clients).
type AuthResponse struct {
	JwtToken string
	User     *UserView
}

type ChangePasswordInput struct {
	Email    string
	Password string
}