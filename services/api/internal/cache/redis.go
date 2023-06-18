package cache

import (
	"context"
	"encoding/json"
	"fmt"
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
	o := &redisOption{}

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
	}
}

func (r *redis) Close() {
	r.cache.Close()
}

func (r *redis) SetString(ctx context.Context, key string, value string) error {
	return r.cache.Set(ctx, key, value, 0).Err()
}

func (r *redis) SetStringWithExpiration(ctx context.Context, key, value string, expiration time.Duration) error {
	err := r.cache.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return r.cache.Expire(ctx, key, expiration).Err()
}

func (r *redis) GetString(ctx context.Context, key string) (string, error) {
	return r.cache.Get(ctx, key).Result()
}

func (r *redis) SetInt(ctx context.Context, key string, value int) error {
	return r.cache.Set(ctx, key, value, 0).Err()
}

func (r *redis) SetIntWithExpiration(ctx context.Context, key string, value int, expiration time.Duration) error {
	err := r.cache.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return r.cache.Expire(ctx, key, expiration).Err()
}

func (r *redis) GetInt(ctx context.Context, key string) (int, error) {
	value, err := r.cache.Get(ctx, key).Int()
	if err != nil {
		return 0, err
	}

	return value, nil
}

func (r *redis) SetStringSlice(ctx context.Context, key string, value []string) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.SetString(ctx, key, string(b))
}

func (r *redis) SetStringSliceWithExpiration(ctx context.Context, key string, value []string, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return r.SetStringWithExpiration(ctx, key, string(b), expiration)
}

func (r *redis) GetStringSlice(ctx context.Context, key string) ([]string, error) {
	value, err := r.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	var s []string

	return s, json.Unmarshal([]byte(value), &s)
}

func (r *redis) SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error {
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
