package jupiter

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type ClientInterface interface {
	GetTokens(ctx context.Context) ([]*Token, error)
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

func (c *client) GetTokens(ctx context.Context) ([]*Token, error) {
	url := fmt.Sprintf("%s/all", c.address)
	resp, err := c.do(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	b, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		errMsg := "failed to get tokens"
		c.log.Error(
			errMsg,
			zap.String("url", url),
			zap.String("status", resp.Status),
			zap.String("body", string(b)),
			zap.Error(err),
		)

		return nil, fmt.Errorf(errMsg)
	}

	var ts []*Token

	return ts, json.Unmarshal(b, &ts)
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
