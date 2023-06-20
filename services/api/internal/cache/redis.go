package cache

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	redislib "github.com/go-redis/redis/v8"
	"go.uber.org/zap"
)

type redis struct {
	log     *zap.Logger
	address string
	cache   *redislib.Client
	mutex   sync.RWMutex
}

type redisOption struct {
	password string
}

type redisOptionFunc func(*redisOption)

func WithRedisPassword(password string) redisOptionFunc {
	return func(o *redisOption) {
		o.password = password
	}
}

func NewRedisCache(host string, port int64, opts ...redisOptionFunc) *redis {
	o := &redisOption{} // nolint: exhaustruct

	for _, opt := range opts {
		opt(o)
	}

	log := logger.NewZapLogger("redis")

	log.Info(
		"connecting to redis",
		zap.String("host", host),
		zap.Int64("port", port),
	)

	address := fmt.Sprintf("%s:%d", host, port)
	rdb := redislib.NewClient(&redislib.Options{ // nolint: exhaustruct
		Addr:     address,
		Password: o.password,
	})

	_, err := rdb.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal(
			"failed to ping redis",
			zap.String("address", address),
			zap.Error(err),
		)
	}

	return &redis{
		log:     log,
		address: address,
		cache:   rdb,
		mutex:   sync.RWMutex{},
	}
}

func (r *redis) Close() {
	r.cache.Close()
}

func (r *redis) SetStringWithExpiration(ctx context.Context, key, value string, expiration time.Duration) error {
	r.mutex.Lock()
	defer r.mutex.Unlock()

	err := r.cache.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return r.cache.Expire(ctx, key, expiration).Err()
}

func (r *redis) GetString(ctx context.Context, key string) (string, error) {
	r.mutex.RLock()
	defer r.mutex.RUnlock()

	return r.cache.Get(ctx, key).Result()
}

func (r *redis) GetToken(ctx context.Context, key string) (*jupiter.Token, error) {
	value, err := r.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	var t *jupiter.Token

	return t, json.Unmarshal([]byte(value), &t)
}

func (r *redis) SetTokenWithExpiration(ctx context.Context, key string, value *jupiter.Token, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.SetStringWithExpiration(ctx, key, string(b), expiration)
}

func (r *redis) GetTokens(ctx context.Context, key string) ([]*jupiter.Token, error) {
	value, err := r.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	var ts []*jupiter.Token

	return ts, json.Unmarshal([]byte(value), &ts)
}

func (r *redis) SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.SetStringWithExpiration(ctx, key, string(b), expiration)
}
