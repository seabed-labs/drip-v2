package server

import (
	"context"
	"errors"
	"fmt"
	"net"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type HTTPServer struct {
	log               *zap.Logger
	server            *http.Server
	httpListenAddress string
}

type Option interface {
	apply(*HTTPServer)
}

type optionFunc func(*HTTPServer)

func (f optionFunc) apply(s *HTTPServer) {
	f(s)
}

func WithLogger(l *zap.Logger) Option {
	return optionFunc(func(s *HTTPServer) {
		s.log = l
	})
}

func (s *HTTPServer) WithOptions(opts ...Option) *HTTPServer {
	for _, opt := range opts {
		opt.apply(s)
	}

	return s
}

func NewHTTPServer(listenAddress int, handler http.Handler, opts ...Option) *HTTPServer {
	httpListenAddress := fmt.Sprintf(":%d", listenAddress)
	mux := http.NewServeMux()
	mux.Handle("/", handler)

	s := &HTTPServer{
		server: &http.Server{ // nolint: exhaustruct
			Addr: httpListenAddress,
			Handler: http.HandlerFunc(
				func(w http.ResponseWriter, r *http.Request) {
					mux.ServeHTTP(w, r)
				},
			),
		},
		log:               logger.NewZapLogger("http_server"),
		httpListenAddress: httpListenAddress,
	}

	return s.WithOptions(opts...)
}

func (h *HTTPServer) Run() error {
	httpListener, err := net.Listen("tcp", h.httpListenAddress)
	if err != nil {
		return err
	}

	h.log.Info(
		"http server listening",
		zap.String("address", h.httpListenAddress),
	)

	errChan := make(chan error, 1)
	go func() {
		errChan <- h.server.Serve(httpListener)
	}()

	switch <-errChan {
	case http.ErrServerClosed:
		return nil
	default:
		return err
	}
}

func (h *HTTPServer) Stop(ctx context.Context) error {
	if h.server != nil {
		h.log.Info("stopping http server")

		errChan := make(chan error, 1)
		go func() {
			errChan <- h.server.Shutdown(ctx)
		}()

		select {
		case err := <-errChan:
			if err != nil && !errors.Is(err, context.Canceled) {
				return fmt.Errorf("error while shutting down HTTP server: %w", err)
			}
		case <-ctx.Done():
			h.log.Info("context canceled while stopping HTTP server")
		}

		h.log.Info("HTTP server stopped")
	}

	return nil
}

func (h *HTTPServer) Name() string {
	return "http_server"
}
