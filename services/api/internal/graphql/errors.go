package graphql

import (
	"context"

	gqlgen "github.com/99designs/gqlgen/graphql"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"go.uber.org/zap"

	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/apperror"
	"github.com/AlemayehuDabi/smart-shield/services/api/internal/platform/logger"
)

// NewErrorPresenter maps our typed apperror.Error onto GraphQL errors, surfacing
// the stable Code in extensions["code"]. Internal/unknown errors are logged with
// their cause but returned to the client as a generic message — details never leak.
func NewErrorPresenter() gqlgen.ErrorPresenterFunc {
	return func(ctx context.Context, err error) *gqlerror.Error {
		gqlErr := gqlgen.DefaultErrorPresenter(ctx, err)
		if gqlErr.Extensions == nil {
			gqlErr.Extensions = map[string]any{}
		}

		appErr, ok := apperror.From(err)
		if !ok {
			logger.FromContext(ctx).Error("unhandled resolver error", zap.Error(err))
			gqlErr.Message = "internal server error"
			gqlErr.Extensions["code"] = string(apperror.CodeInternal)
			return gqlErr
		}

		gqlErr.Extensions["code"] = string(appErr.Code)
		if appErr.Code == apperror.CodeInternal {
			logger.FromContext(ctx).Error("internal error", zap.Error(err))
			gqlErr.Message = "internal server error"
		} else {
			gqlErr.Message = appErr.Message
		}
		return gqlErr
	}
}

// NewRecoverFunc turns a resolver panic into a logged internal error instead of
// crashing the server.
func NewRecoverFunc(log *zap.Logger) gqlgen.RecoverFunc {
	return func(ctx context.Context, err any) error {
		log.Error("recovered from panic in resolver", zap.Any("panic", err))
		return apperror.New(apperror.CodeInternal, "internal server error")
	}
}
