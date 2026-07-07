// Package scalar provides the gqlgen binding for the Decimal GraphQL scalar.
//
// Decimal is a *type alias* to shopspring/decimal.Decimal, so GraphQL model
// fields end up as exactly the same Go type our domain uses — resolvers assign
// domain decimals with no conversion. gqlgen locates MarshalDecimal /
// UnmarshalDecimal here because gqlgen.yml binds the scalar to scalar.Decimal.
package scalar

import (
	"encoding/json"
	"fmt"
	"io"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/shopspring/decimal"
)

// Decimal is the money/quantity scalar. Serialized as a string on the wire to
// preserve precision (JSON numbers can lose it).
type Decimal = decimal.Decimal

// MarshalDecimal writes a Decimal as a JSON string.
func MarshalDecimal(d Decimal) graphql.Marshaler {
	return graphql.WriterFunc(func(w io.Writer) {
		_, _ = io.WriteString(w, strconv.Quote(d.String()))
	})
}

// UnmarshalDecimal accepts a string or a JSON number.
func UnmarshalDecimal(v any) (Decimal, error) {
	switch t := v.(type) {
	case string:
		return decimal.NewFromString(t)
	case int:
		return decimal.NewFromInt(int64(t)), nil
	case int64:
		return decimal.NewFromInt(t), nil
	case float64:
		return decimal.NewFromFloat(t), nil
	case json.Number:
		return decimal.NewFromString(string(t))
	default:
		return decimal.Decimal{}, fmt.Errorf("%T is not a valid Decimal", v)
	}
}
