package postgres

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

// foreignKeyViolation is the Postgres SQLSTATE for an FK constraint breach.
const foreignKeyViolation = "23503"

// isForeignKeyViolation reports whether err is a Postgres FK-violation error.
func isForeignKeyViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == foreignKeyViolation
}
