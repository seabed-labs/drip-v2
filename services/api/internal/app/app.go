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
	GetToken(ctx context.Context, key string) (*jupiter.Token, error)
	GetTokens(ctx context.Context, key string) ([]*jupiter.Token, error)
	SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error
}

type appQueueInterface interface {
	Publish(queueName, contentType string, body string) error
}

type app struct {
	log        *zap.Logger
	translator appTranslatorInterface
	jupiter    jupiter.ClientInterface
	cache      appCacheInterface
	queue      appQueueInterface
}

func NewApp(translator appTranslatorInterface, jupiter jupiter.ClientInterface, cache appCacheInterface, queue appQueueInterface) *app {
	return &app{
		log:        logger.NewZapLogger("app"),
		translator: translator,
		jupiter:    jupiter,
		cache:      cache,
		queue:      queue,
	}
}

func (a *app) GetToken(c echo.Context) error {
	ctx := c.Request().Context()

	address := c.Param("token_address")
	if address == jupiter.TokensCacheKey {
		return c.String(http.StatusBadRequest, "invalid token address")
	}

	ts, err := a.cache.GetToken(ctx, address)
	if err != nil {
		a.log.Warn(
			"failed to get token from cache",
			zap.String("address", address),
			zap.Error(err),
		)

		return c.String(http.StatusNotFound, "token not found")
	}

	return c.JSON(http.StatusOK, ts)

}

func (a *app) GetTokens(c echo.Context) error {
	ctx := c.Request().Context()

	ts, err := a.cache.GetTokens(ctx, jupiter.TokensCacheKey)
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

	return c.JSON(http.StatusOK, ts)
}

func (a *app) PublishAccount(c echo.Context, payload []byte) error {
	acc, err := decodeAccountPayload(payload)
	if err != nil {
		errMsg := "failed to decode account"
		a.log.Error(
			errMsg,
			zap.Error(err),
		)

		return c.String(http.StatusInternalServerError, errMsg)
	}

	err = a.queue.Publish(QueueAccount, "text/plain", string(acc.PublicKey))
	if err != nil {
		errMsg := "failed to publish account"
		a.log.Error(
			errMsg,
			zap.String("queue", QueueTransaction),
			zap.String("account_publickey", string(acc.PublicKey)),
			zap.Error(err),
		)

		return c.String(http.StatusInternalServerError, errMsg)
	}

	return c.JSON(http.StatusAccepted, "published account")
}

func (a *app) PublishTransaction(c echo.Context, payload []byte) error {
	tx, err := decodeTransactionPayload(payload)
	if err != nil {
		errMsg := "failed to decode transaction"
		a.log.Error(
			errMsg,
			zap.Error(err),
		)

		return c.String(http.StatusInternalServerError, errMsg)
	}

	err = a.queue.Publish(QueueTransaction, "text/plain", string(tx.Signature))
	if err != nil {
		errMsg := "failed to publish transaction"
		a.log.Error(
			errMsg,
			zap.String("queue", QueueTransaction),
			zap.String("transaction_signature", string(tx.Signature)),
			zap.Error(err),
		)

		return c.String(http.StatusInternalServerError, errMsg)
	}

	return c.JSON(http.StatusAccepted, "published transaction")
}
