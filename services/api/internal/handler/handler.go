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
	GetTokens(ctx echo.Context) error
	PublishTransaction(ctx echo.Context, payload []byte) error
	PublishAccount(ctx echo.Context, payload []byte) error
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
	h.handler.GET("/health", func(c echo.Context) error {
		return c.String(http.StatusOK, "healthy")
	})

	h.handler.GET("/tokens", func(c echo.Context) error {
		err := h.app.GetTokens(c)
		if err != nil {
			h.log.Error(
				"failed to handle app.GetTokens GET request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.GET("/token/:token_address", func(c echo.Context) error {
		return echo.ErrNotImplemented
	})

	h.handler.GET("/wallet/:wallet_address/positions", func(c echo.Context) error {
		return echo.ErrNotImplemented
	})

	h.handler.POST("/transaction", func(c echo.Context) error {
		r := c.Request()
		defer r.Body.Close()

		payload, err := io.ReadAll(r.Body)
		if err != nil {
			h.log.Error(ErrReadingPayload.Error())
			return c.String(http.StatusBadRequest, ErrReadingPayload.Error())
		}

		err = h.app.PublishTransaction(c, payload)
		if err != nil {
			h.log.Error(
				"failed to handle app.PublishTransaction POST request",
				zap.Error(err),
			)
		}

		return err
	})

	h.handler.POST("/account", func(c echo.Context) error {
		r := c.Request()
		defer r.Body.Close()

		payload, err := io.ReadAll(r.Body)
		if err != nil {
			h.log.Error(ErrReadingPayload.Error())
			return c.String(http.StatusBadRequest, ErrReadingPayload.Error())
		}

		err = h.app.PublishAccount(c, payload)
		if err != nil {
			h.log.Error(
				"failed to handle app.PublishAccount POST request",
				zap.Error(err),
			)
		}

		return err
	})
}
