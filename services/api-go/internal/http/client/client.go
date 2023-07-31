package client

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type HTTPClient struct {
	log    *zap.Logger
	client *http.Client
}

type Option interface {
	apply(*HTTPClient)
}

type optionFunc func(*HTTPClient)

func (f optionFunc) apply(c *HTTPClient) {
	f(c)
}

func WithLogger(l *zap.Logger) Option {
	return optionFunc(func(c *HTTPClient) {
		c.log = l
	})
}

func WithTransport(t http.RoundTripper) Option {
	return optionFunc(func(c *HTTPClient) {
		c.client.Transport = t
	})
}

func WithTimeout(t time.Duration) Option {
	return optionFunc(func(c *HTTPClient) {
		c.client.Timeout = t
	})
}

func (c *HTTPClient) WithOptions(opts ...Option) *HTTPClient {
	for _, opt := range opts {
		opt.apply(c)
	}

	return c
}

func NewHTTPClient(opts ...Option) *HTTPClient {
	c := &HTTPClient{
		log:    logger.NewZapLogger("http_client"),
		client: &http.Client{}, // nolint: exhaustruct
	}

	return c.WithOptions(opts...)
}

func (h *HTTPClient) Do(ctx context.Context, method, url string, payload interface{}) (*http.Response, error) {
	var (
		jsonPayload []byte
		err         error
	)

	if payload != nil {
		jsonPayload, err = json.Marshal(payload)
		if err != nil {
			return nil, err
		}
	}

	req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewBuffer(jsonPayload))
	if err != nil {
		return nil, err
	}

	return h.client.Do(req)
}
