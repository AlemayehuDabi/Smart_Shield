package dto

// for now - i am going to change after portifolio 
type UpdateUserInput struct {
	Name *string
	Email *string
}

// UserView is safe to expose over GraphQL / JSON.
type UserView struct {
	ID    string
	Email string
	Name  string
	Role  string
}