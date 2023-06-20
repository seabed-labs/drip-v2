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

type httpServer struct {
	log               *zap.Logger
	http              *http.Server
	httpListenAddress string
}

func NewHTTPServer(listenAddress int, handler http.Handler) *httpServer {
	log := logger.NewZapLogger("http_server")
	httpListenAddress := fmt.Sprintf(":%d", listenAddress)
	mux := http.NewServeMux()
	mux.Handle("/", handler)

	return &httpServer{
		http: &http.Server{ // nolint: exhaustruct
			Addr: httpListenAddress,
			Handler: http.HandlerFunc(
				func(w http.ResponseWriter, r *http.Request) {
					mux.ServeHTTP(w, r)
				}),
		},
		log:               log,
		httpListenAddress: httpListenAddress,
	}
}

func (s *httpServer) Run() error {
	httpListener, err := net.Listen("tcp", s.httpListenAddress)
	if err != nil {
		return err
	}

	s.log.Info(
		"http server listening",
		zap.String("address", s.httpListenAddress),
	)

	go func() {
		if err := s.http.Serve(httpListener); err != nil {
			if err != http.ErrServerClosed {
				panic(err)
			}
		}
	}()

	return nil
}

func (s *httpServer) Stop(ctx context.Context) error {
	if s.http != nil {
		s.log.Info("stopping http server")
		if err := s.http.Shutdown(ctx); err != nil {
			if !errors.Is(err, context.Canceled) {
				return fmt.Errorf("error while shutting down http server: %w", err)
			}

			s.log.Info("context canceled while stopping http server")
		}

		s.log.Info("http server stopped")
	}

	return nil
}

func (s *httpServer) Name() string {
	return "http_server"
}
