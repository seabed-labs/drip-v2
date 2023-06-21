package fetcher

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type ClientInterface interface {
	GetAccount(ctx context.Context, publicKey app.AccountPublicKey) ([]string, error)
	GetTransaction(ctx context.Context, signature app.TransactionSignature) ([]string, error)
}

type client struct {
	log    *zap.Logger
	base   string
	client *http.Client
}

func NewClient(host string, port int64) *client {
	return &client{
		log:    logger.NewZapLogger("fetcher_client"),
		base:   fmt.Sprintf("http://%s:%d", host, port),
		client: http.DefaultClient,
	}
}

func (c *client) GetAccount(ctx context.Context, publicKey app.AccountPublicKey) ([]string, error) {
	url := fmt.Sprintf("%s/account/%s", c.base, publicKey)
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
		errMsg := "failed to get account"
		c.log.Error(
			errMsg,
			zap.String("url", url),
			zap.String("status", resp.Status),
			zap.String("body", string(b)),
			zap.Error(err),
		)

		return nil, fmt.Errorf(errMsg)
	}

	return nil, nil // TODO: parse values
}

func (c *client) GetTransaction(ctx context.Context, signature app.TransactionSignature) ([]string, error) {
	url := fmt.Sprintf("%s/tx/%s", c.base, signature)
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
		errMsg := "failed to get transaction"
		c.log.Error(
			errMsg,
			zap.String("url", url),
			zap.String("status", resp.Status),
			zap.String("body", string(b)),
			zap.Error(err),
		)

		return nil, fmt.Errorf(errMsg)
	}

	return nil, nil // TODO: parse values
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
