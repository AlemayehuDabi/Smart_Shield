package domain


type Role string

const (
    RoleUser  Role = "user"
    RoleAdmin Role = "admin"
)

type User struct {
	ID       string
	Email    string
	Name     string
	Role     Role
	Password string
}
