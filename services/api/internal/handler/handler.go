package handler

import (
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

type handler struct {
	log     *zap.Logger
	handler *echo.Echo
	app     app.AppInterface
}

func NewHandler(app app.AppInterface) *handler {
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
		return echo.ErrNotImplemented
	})
}
