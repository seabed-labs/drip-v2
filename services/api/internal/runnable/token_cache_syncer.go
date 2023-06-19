package runnable

import (
	"context"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type tokenCacheSyncerCacheInterface interface {
	SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error
	SetTokenWithExpiration(ctx context.Context, key string, value *jupiter.Token, expiration time.Duration) error
}

type tokenCacheSyncer struct {
	doneC   chan struct{}
	log     *zap.Logger
	cache   tokenCacheSyncerCacheInterface
	jupiter jupiter.ClientInterface
}

func NewTokenCacheSyncer(cache tokenCacheSyncerCacheInterface, jupiter jupiter.ClientInterface) *tokenCacheSyncer {
	return &tokenCacheSyncer{
		doneC:   make(chan struct{}),
		log:     logger.NewZapLogger("token_cache_syncer"),
		cache:   cache,
		jupiter: jupiter,
	}
}

func (c *tokenCacheSyncer) Run() error {
	ctx := context.Background()

	ticker := time.NewTicker(time.Second * 5)
	for {
		select {
		case <-c.doneC:
			return nil
		case <-ticker.C:
			ts, err := c.jupiter.GetTokens(ctx)
			if err != nil {
				errMsg := "failed to get tokens"
				c.log.Error(
					errMsg,
					zap.Error(err),
				)

				continue
			}

			if err := c.cache.SetTokensWithExpiration(ctx, jupiter.TokensCacheKey, ts, jupiter.TokensCacheRetentionPeriod); err != nil {
				c.log.Error(
					"failed to update tokens cache",
					zap.String("key", jupiter.TokensCacheKey),
					zap.Error(err),
				)
			}

			for _, t := range ts {
				if err := c.cache.SetTokenWithExpiration(ctx, string(t.Address), t, jupiter.TokensCacheRetentionPeriod); err != nil {
					c.log.Error(
						"failed to update token cache",
						zap.String("key", string(t.Address)),
						zap.String("name", string(t.Name)),
						zap.Error(err),
					)
				}
			}
		}
	}
}

func (c *tokenCacheSyncer) Stop(ctx context.Context) error {
	c.doneC <- struct{}{}
	return nil
}

func (c *tokenCacheSyncer) Name() string {
	return "tokenCacheSyncer"
}
