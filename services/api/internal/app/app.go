package app

import (
	"context"
	"net/http"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

type appTranslatorInterface interface{}

type appCacheInterface interface {
	SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error
	GetTokens(ctx context.Context, key string) ([]*jupiter.Token, error)
}

type AppInterface interface {
	GetTokens(ctx echo.Context) error
}

type app struct {
	log        *zap.Logger
	translator appTranslatorInterface
	jupiter    jupiter.ClientInterface
	cache      appCacheInterface
}

func NewApp(translator appTranslatorInterface, jupiter jupiter.ClientInterface, cache appCacheInterface) *app {
	return &app{
		log:        logger.NewZapLogger("app"),
		translator: translator,
		jupiter:    jupiter,
		cache:      cache,
	}
}

func (a *app) GetTokens(c echo.Context) error {
	ctx := c.Request().Context()

	ts, err := a.cache.GetTokens(ctx, jupiter.RedisJupiterTokensKey)
	if err != nil {
		a.log.Warn(
			"failed to get tokens from cache",
			zap.Error(err),
		)
	} else {
		return c.JSON(http.StatusOK, ts)
	}

	ts, err = a.jupiter.GetTokens(ctx)
	if err != nil {
		errMsg := "failed to get tokens"
		a.log.Error(
			errMsg,
			zap.Error(err),
		)

		return c.String(http.StatusInternalServerError, errMsg)
	}

	if err := a.cache.SetTokensWithExpiration(ctx, jupiter.RedisJupiterTokensKey, ts, time.Minute*10); err != nil {
		a.log.Error(
			"failed to update the cache",
			zap.String("key", jupiter.RedisJupiterTokensKey),
			zap.Error(err),
		)
	}

	return c.JSON(http.StatusOK, ts)
}
