package apperrors

import "errors"

var (
	ErrNotFound      = errors.New("resource not found")
	ErrUnauthorized  = errors.New("unauthorized")
	ErrInvalidInput  = errors.New("invalid input")
	ErrAlreadyExists = errors.New("resource already exists")
	ErrInternal      = errors.New("internal server error")
)

type AppError struct {
	Type    error
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func NewNotFound(msg string) AppError {
	return AppError{Type: ErrNotFound, Message: msg}
}

func NewUnauthorized(msg string) AppError {
	return AppError{Type: ErrUnauthorized, Message: msg}
}

func NewInvalidInput(msg string) AppError {
	return AppError{Type: ErrInvalidInput, Message: msg}
}

func NewAlreadyExists(msg string) AppError {
	return AppError{Type: ErrAlreadyExists, Message: msg}
}

func NewInternal(msg string) AppError {
	return AppError{Type: ErrInternal, Message: msg}
}
