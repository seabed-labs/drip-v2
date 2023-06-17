package handler

import (
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"go.uber.org/zap"
)

type handler struct {
	log     *zap.Logger
	handler *echo.Echo
}

func NewHandler() *handler {
	h := &handler{
		log:     logger.NewZapLogger("server"),
		handler: echo.New(),
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
		return echo.ErrNotImplemented
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
