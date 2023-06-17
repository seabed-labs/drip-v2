package main

import (
	"context"
	"fmt"

	"go.uber.org/zap"

	"database/sql"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/cache"
	"github.com/dcaf-labs/drip-v2/services/api/internal/handler"
	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/dcaf-labs/drip-v2/services/api/internal/runner"
	"github.com/dcaf-labs/drip-v2/services/api/internal/server"
	"github.com/dcaf-labs/drip-v2/services/api/internal/translator"
	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
)

func main() {
	log := logger.NewZapLogger("main")

	var (
		pHost     = "localhost"
		pDatabase = "micro"
		pPort     = 5432
		pUser     = "docker"
		pPassword = "docker"
	)

	log.Info(
		"connecting to database",
		zap.String("host", pHost),
		zap.String("name", pDatabase),
		zap.Int("port", pPort),
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
		rHost     = "localhost"
		rPort     = 6379
		rPassword = "docker"
	)

	log.Info(
		"connecting to redis",
		zap.String("host", rHost),
		zap.Int("port", rPort),
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
