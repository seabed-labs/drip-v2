package cache

import (
	"context"
	"encoding/json"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/go-redis/redis/v8"
)

type redisCache struct {
	rdb *redis.Client
}

func NewRedisCache(rdb *redis.Client) *redisCache {
	return &redisCache{rdb: rdb}
}

func (c *redisCache) SetString(ctx context.Context, key string, value string) error {
	return c.rdb.Set(ctx, key, value, 0).Err()
}

func (c *redisCache) SetStringWithExpiration(ctx context.Context, key, value string, expiration time.Duration) error {
	err := c.rdb.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return c.rdb.Expire(ctx, key, expiration).Err()
}

func (c *redisCache) GetString(ctx context.Context, key string) (string, error) {
	return c.rdb.Get(ctx, key).Result()
}

func (c *redisCache) SetInt(ctx context.Context, key string, value int) error {
	return c.rdb.Set(ctx, key, value, 0).Err()
}

func (c *redisCache) SetIntWithExpiration(ctx context.Context, key string, value int, expiration time.Duration) error {
	err := c.rdb.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return c.rdb.Expire(ctx, key, expiration).Err()
}

func (c *redisCache) GetInt(ctx context.Context, key string) (int, error) {
	value, err := c.rdb.Get(ctx, key).Int()
	if err != nil {
		return 0, err
	}

	return value, nil
}

func (c *redisCache) SetStringSlice(ctx context.Context, key string, value []string) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return c.SetString(ctx, key, string(b))
}

func (c *redisCache) SetStringSliceWithExpiration(ctx context.Context, key string, value []string, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return c.SetStringWithExpiration(ctx, key, string(b), expiration)
}

func (c *redisCache) GetStringSlice(ctx context.Context, key string) ([]string, error) {
	value, err := c.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	var s []string

	return s, json.Unmarshal([]byte(value), &s)
}

func (c *redisCache) SetTokensWithExpiration(ctx context.Context, key string, value []*jupiter.Token, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return c.SetStringWithExpiration(ctx, key, string(b), expiration)
}

func (c *redisCache) GetTokens(ctx context.Context, key string) ([]*jupiter.Token, error) {
	value, err := c.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	var ts []*jupiter.Token

	return ts, json.Unmarshal([]byte(value), &ts)
}
