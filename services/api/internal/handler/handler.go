package handler

import (
	"io"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

type handlerAppInterface interface {
	GetToken(ctx echo.Context) error
	GetTokens(ctx echo.Context) error
	GetPositions(ctx echo.Context) error
	PublishAccount(ctx echo.Context, payload []byte) error
	PublishTransaction(ctx echo.Context, payload []byte) error
}

type handler struct {
	log     *zap.Logger
	handler *echo.Echo
	app     handlerAppInterface
}

func NewHandler(app handlerAppInterface) *handler {
	h := &handler{
		log:     logger.NewZapLogger("server"),
		handler: echo.New(),
		app:     app,
	}

	h.handler.HideBanner = true
	h.handler.Use(middleware.CORS())
	h.registerRoutes()

	return h
}

func (h *handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.handler.ServeHTTP(w, r)
}

func (h *handler) registerRoutes() {
	h.handler.GET("/health", func(ctx echo.Context) error {
		return ctx.String(http.StatusOK, "healthy")
	})

	h.handler.GET("/tokens", func(ctx echo.Context) error {
		err := h.app.GetTokens(ctx)
		if err != nil {
			h.log.Error(
				"failed to handle app.GetTokens GET request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.GET("/tokens/:token_address", func(ctx echo.Context) error {
		err := h.app.GetToken(ctx)
		if err != nil {
			h.log.Error(
				"failed to handle app.GetToken GET request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.POST("/account", func(ctx echo.Context) error {
		r := ctx.Request()
		defer r.Body.Close()

		payload, err := io.ReadAll(r.Body)
		if err != nil {
			h.log.Error(ErrReadingPayload.Error())
			return ctx.String(http.StatusBadRequest, ErrReadingPayload.Error())
		}

		err = h.app.PublishAccount(ctx, payload)
		if err != nil {
			h.log.Error(
				"failed to handle app.PublishAccount POST request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.POST("/transaction", func(ctx echo.Context) error {
		r := ctx.Request()
		defer r.Body.Close()

		payload, err := io.ReadAll(r.Body)
		if err != nil {
			h.log.Error(ErrReadingPayload.Error())
			return ctx.String(http.StatusBadRequest, ErrReadingPayload.Error())
		}

		err = h.app.PublishTransaction(ctx, payload)
		if err != nil {
			h.log.Error(
				"failed to handle app.PublishTransaction POST request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.GET("/wallet/:public_key/positions", func(ctx echo.Context) error {
		return echo.ErrNotImplemented
	})
}
