package main

import (
	"go.uber.org/zap"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/cache"
	"github.com/dcaf-labs/drip-v2/services/api/internal/config"
	"github.com/dcaf-labs/drip-v2/services/api/internal/fetcher"
	"github.com/dcaf-labs/drip-v2/services/api/internal/handler"
	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/dcaf-labs/drip-v2/services/api/internal/queue"
	"github.com/dcaf-labs/drip-v2/services/api/internal/runnable"
	"github.com/dcaf-labs/drip-v2/services/api/internal/server"
	"github.com/dcaf-labs/drip-v2/services/api/internal/translator"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

func main() {
	config.Initialize()
	log := logger.NewZapLogger("main")

	t := translator.NewTranslator(
		"postgres",
		viper.GetString("postgres.database"),
		viper.GetString("postgres.host"),
		viper.GetInt64("postgres.port"),
		translator.WithDatabaseUser(viper.GetString("postgres.user")),
		translator.WithDatabasePassword(viper.GetString("postgres.password")),
		translator.WithDatabaseSSLMode(viper.GetString("postgres.sslmode")),
	)
	defer t.Close()

	if err := t.MigrateUp("./modeler/migrations"); err != nil {
		log.Fatal(
			"failed to migrate up",
			zap.Error(err),
		)
	}

	rc := cache.NewRedisCache(
		viper.GetString("redis.host"),
		viper.GetInt64("redis.port"),
		cache.WithRedisPassword(viper.GetString("redis.password")),
	)
	defer rc.Close()

	rq := queue.NewRabbitMQ(
		viper.GetString("rabbitmq.host"),
		viper.GetInt64("rabbitmq.port"),
		queue.WithRabbitMQUser(viper.GetString("rabbitmq.user")),
		queue.WithRabbitMQPassword(viper.GetString("rabbitmq.password")),
	)
	defer rq.Close()

	rq.DeclareQueue(app.AccountQueue, app.TransactionQueue)

	jup := jupiter.NewClient()
	f := fetcher.NewClient(
		viper.GetString("fetcher.host"),
		viper.GetInt64("fetcher.port"),
	)

	a := app.NewApp(t, jup, rc, rq)

	runnable.NewRunner(
		server.NewHTTPServer(20000, handler.NewHandler(a)),
		runnable.NewTokenCacheSyncer(rc, jup),
		runnable.NewAccountConsumer(rq, t, f),
		runnable.NewTransactionConsumer(rq, t, f),
	).Run().ThenStop()
}
