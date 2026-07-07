// Package apperror defines typed application errors used across every layer.
//
// Usecases return these; the GraphQL layer (internal/graphql/errors.go) maps the
// Code onto an extensions{code} field. Keeping the taxonomy here — not in any
// module's domain — means both the user and portfolio modules share one error
// vocabulary without importing each other.
package apperror

import (
	"errors"
	"fmt"
)

// Code is a stable, transport-agnostic error category.
type Code string

const (
	CodeNotFound     Code = "NOT_FOUND"
	CodeUnauthorized Code = "UNAUTHENTICATED"
	CodeForbidden    Code = "FORBIDDEN"
	CodeInvalidInput Code = "INVALID_INPUT"
	CodeConflict     Code = "CONFLICT"
	CodeInternal     Code = "INTERNAL"
)

// Error is the concrete application error carrying a Code, a client-safe
// message, and an optional wrapped cause (never exposed to clients).
type Error struct {
	Code    Code
	Message string
	cause   error
}

func (e *Error) Error() string {
	if e.cause != nil {
		return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.cause)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap exposes the cause for errors.Is / errors.As chains.
func (e *Error) Unwrap() error { return e.cause }

// New builds an Error with a code and message.
func New(code Code, msg string) *Error { return &Error{Code: code, Message: msg} }

// Wrap builds an Error that carries an underlying cause (for logs, not clients).
func Wrap(code Code, msg string, cause error) *Error {
	return &Error{Code: code, Message: msg, cause: cause}
}

// From extracts an *Error from any error, or nil if the chain has none.
func From(err error) (*Error, bool) {
	var e *Error
	if errors.As(err, &e) {
		return e, true
	}
	return nil, false
}

// CodeOf returns the Code of err, defaulting to CodeInternal for unknown errors.
func CodeOf(err error) Code {
	if e, ok := From(err); ok {
		return e.Code
	}
	return CodeInternal
}

// --- ergonomic constructors ---------------------------------------------------

// NotFound => the requested resource does not exist.
func NotFound(msg string) *Error { return New(CodeNotFound, msg) }

// Unauthorized => the caller is not authenticated (or credentials are invalid).
func Unauthorized(msg string) *Error { return New(CodeUnauthorized, msg) }

// Forbidden => authenticated but not allowed to touch this resource.
func Forbidden(msg string) *Error { return New(CodeForbidden, msg) }

// InvalidInput => the request failed validation.
func InvalidInput(msg string) *Error { return New(CodeInvalidInput, msg) }

// Conflict => the operation violates a uniqueness/state constraint.
func Conflict(msg string) *Error { return New(CodeConflict, msg) }

// Internal => an unexpected failure. `cause` is logged, never shown to clients.
func Internal(cause error) *Error {
	return Wrap(CodeInternal, "internal server error", cause)
}
