package jupiter

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	c "github.com/dcaf-labs/drip-v2/services/api/internal/http/client"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type ClientInterface interface {
	GetTokens(ctx context.Context) ([]*Token, error)
}

type client struct {
	log    *zap.Logger
	base   string
	client *c.HTTPClient
}

func NewClient() *client {
	log := logger.NewZapLogger("jupiter_client")
	return &client{
		log:    log,
		base:   "https://token.jup.ag",
		client: c.NewHTTPClient(c.WithLogger(log)),
	}
}

func (c *client) GetTokens(ctx context.Context) ([]*Token, error) {
	url := fmt.Sprintf("%s/all", c.base)
	resp, err := c.client.Do(ctx, http.MethodGet, url, nil)
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
