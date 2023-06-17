package cache

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"
)

type RedisInterface interface {
	SetString(ctx context.Context, key string, value string) error
	SetStringWithExpiration(ctx context.Context, key, value string, expiration time.Duration) error
	GetString(ctx context.Context, key string) (string, error)
	SetInt(ctx context.Context, key string, value int) error
	SetIntWithExpiration(ctx context.Context, key string, value int, expiration time.Duration) error
	GetInt(ctx context.Context, key string) (int, error)
	SetStringSlice(ctx context.Context, key string, value []string) error
	SetStringSliceWithExpiration(ctx context.Context, key string, value []string, expiration time.Duration) error
	GetStringSlice(ctx context.Context, key string) ([]string, error)
}

type RedisCache struct {
	rdb *redis.Client
}

func NewRedisCache(rdb *redis.Client) *RedisCache {
	return &RedisCache{rdb: rdb}
}

func (c *RedisCache) SetString(ctx context.Context, key string, value string) error {
	return c.rdb.Set(ctx, key, value, 0).Err()
}

func (c *RedisCache) SetStringWithExpiration(ctx context.Context, key, value string, expiration time.Duration) error {
	err := c.rdb.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return c.rdb.Expire(ctx, key, expiration).Err()
}

func (c *RedisCache) GetString(ctx context.Context, key string) (string, error) {
	return c.rdb.Get(ctx, key).Result()
}

func (c *RedisCache) SetInt(ctx context.Context, key string, value int) error {
	return c.rdb.Set(ctx, key, value, 0).Err()
}

func (c *RedisCache) SetIntWithExpiration(ctx context.Context, key string, value int, expiration time.Duration) error {
	err := c.rdb.Set(ctx, key, value, 0).Err()
	if err != nil {
		return err
	}

	return c.rdb.Expire(ctx, key, expiration).Err()
}

func (c *RedisCache) GetInt(ctx context.Context, key string) (int, error) {
	value, err := c.rdb.Get(ctx, key).Int()
	if err != nil {
		return 0, err
	}

	return value, nil
}

func (c *RedisCache) SetStringSlice(ctx context.Context, key string, value []string) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return c.SetString(ctx, key, string(b))
}

func (c *RedisCache) SetStringSliceWithExpiration(ctx context.Context, key string, value []string, expiration time.Duration) error {
	b, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return c.SetStringWithExpiration(ctx, key, string(b), expiration)
}

func (c *RedisCache) GetStringSlice(ctx context.Context, key string) ([]string, error) {
	value, err := c.GetString(ctx, key)
	if err != nil {
		return nil, err
	}

	s := []string{}

	return s, json.Unmarshal([]byte(value), &s)
}
