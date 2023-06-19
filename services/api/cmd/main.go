package main

import (
	"go.uber.org/zap"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/cache"
	"github.com/dcaf-labs/drip-v2/services/api/internal/config"
	"github.com/dcaf-labs/drip-v2/services/api/internal/handler"
	"github.com/dcaf-labs/drip-v2/services/api/internal/jupiter"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/dcaf-labs/drip-v2/services/api/internal/queue"
	"github.com/dcaf-labs/drip-v2/services/api/internal/runner"
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

	if err := t.Migrate("./modeler/migrations"); err != nil {
		log.Fatal(
			"failed to migrate",
			zap.Error(err),
		)
	}

	rc := cache.NewRedisCache(
		viper.GetString("redis.host"),
		viper.GetInt64("redis.port"),
		cache.WithRedisPassword(viper.GetString("redis.password")),
	)
	defer rc.Close()

	rmq := queue.NewRabbitMQ(
		viper.GetString("rabbitmq.host"),
		viper.GetInt64("rabbitmq.port"),
		queue.WithRabbitMQUser(viper.GetString("rabbitmq.user")),
		queue.WithRabbitMQPassword(viper.GetString("rabbitmq.password")),
	)
	defer rmq.Close()

	rmq.DeclareQueue(app.QueueAccount, app.QueueTransaction)

	jupiter := jupiter.NewClient()
	app := app.NewApp(t, jupiter, rc, rmq)

	h := handler.NewHandler(app)
	srv := server.NewHTTPServer(20000, h)

	runner.NewRunner(
		srv,
	).Run().ThenStop()
}
