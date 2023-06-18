package main

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"database/sql"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/cache"
	"github.com/dcaf-labs/drip-v2/services/api/internal/config"
	"github.com/dcaf-labs/drip-v2/services/api/internal/handler"
	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/dcaf-labs/drip-v2/services/api/internal/runner"
	"github.com/dcaf-labs/drip-v2/services/api/internal/server"
	"github.com/dcaf-labs/drip-v2/services/api/internal/translator"
	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

func main() {
	config.Initialize()
	log := logger.NewZapLogger("main")

	var (
		pDatabase = viper.GetString("postgres.database")
		pHost     = viper.GetString("postgres.host")
		pPort     = viper.GetInt64("postgres.port")
		pUser     = viper.GetString("postgres.user")
		pPassword = viper.GetString("postgres.password")
	)

	log.Info(
		"connecting to database",
		zap.String("name", pDatabase),
		zap.String("host", pHost),
		zap.Int64("port", pPort),
	)

	pAddress := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=disable",
		pUser,
		pPassword,
		pHost,
		pPort,
		pDatabase,
	)
	pdb, err := sql.Open("postgres", pAddress)
	if err != nil {
		log.Fatal(
			"failed to connect to the database",
			zap.String("address", pAddress),
			zap.Error(err),
		)
	}

	defer pdb.Close()
	if err = pdb.Ping(); err != nil {
		log.Fatal(
			"failed to ping the database",
			zap.String("address", pAddress),
			zap.Error(err),
		)
	}

	var (
		rHost     = viper.GetString("redis.host")
		rPort     = viper.GetInt64("redis.port")
		rPassword = viper.GetString("redis.password")
	)

	log.Info(
		"connecting to redis",
		zap.String("host", rHost),
		zap.Int64("port", rPort),
	)

	rAddress := fmt.Sprintf("%s:%d", rHost, rPort)
	rdb := redis.NewClient(&redis.Options{ // nolint: exhaustruct
		Addr:     rAddress,
		Password: rPassword,
	})
	defer rdb.Close()

	_, err = rdb.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal(
			"failed to ping redis",
			zap.String("address", rAddress),
			zap.Error(err),
		)
	}

	t := translator.NewTranslator(pdb)
	if err = t.Migrate("./modeler/migrations"); err != nil {
		log.Fatal(
			"failed to migrate",
			zap.Error(err),
		)
	}

	rc := cache.NewRedisCache(rdb)
	jupiter := jupiter.NewClient()

	app := app.NewApp(t, jupiter, rc)

	h := handler.NewHandler(app)
	srv := server.NewHTTPServer(8080, h)

	runner.NewRunner(
		srv,
	).Run().ThenStop()
}
