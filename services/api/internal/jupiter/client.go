package jupiter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type ClientInterface interface {
	GetTokens(ctx context.Context, strict bool)
}

type client struct {
	log     *zap.Logger
	address string
	client  *http.Client
}

func NewClient() *client {
	return &client{
		log:     logger.NewZapLogger("jupiter_client"),
		address: "https://token.jup.ag",
		client:  http.DefaultClient,
	}
}

func (c *client) GetTokens(ctx context.Context, strict bool) error {
	urlSuffix := "all"
	if strict {
		urlSuffix = "strict"
	}

	url := fmt.Sprintf("%s/%s", c.address, urlSuffix)
	resp, err := c.do(ctx, http.MethodGet, url, nil)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	// TODO marshal data

	return nil
}

func (c *client) do(ctx context.Context, method, url string, payload interface{}) (*http.Response, error) {
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

	return c.client.Do(req)
}
