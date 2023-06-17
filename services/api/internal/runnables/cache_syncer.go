package runnables

import (
	"context"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/cache"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type tokenCacheSyncer struct {
	doneC chan struct{}
	log   *zap.Logger
	redis cache.RedisInterface
}

func NewTokenCacheSyncer(redis cache.RedisInterface) *tokenCacheSyncer {
	return &tokenCacheSyncer{
		doneC: make(chan struct{}),
		log:   logger.NewZapLogger("token_cache_syncer"),
		redis: redis,
	}
}

func (s *tokenCacheSyncer) Run() error {
	ticker := time.NewTicker(time.Minute)
	_ = context.Background()
	for {
		select {
		case <-s.doneC:
			return nil
		case <-ticker.C:
			// TODO: Cache logic
		}
	}
}

func (s *tokenCacheSyncer) Stop(ctx context.Context) error {
	s.doneC <- struct{}{}
	return nil
}

func (s *tokenCacheSyncer) Name() string {
	return "tokenCacheSyncer"
}
