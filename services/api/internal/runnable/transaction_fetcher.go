package runnable

import (
	"context"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type transactionFetcherQueueInterface interface {
	Consume(name, consumer string) (<-chan amqp.Delivery, error)
}

type transactionFetcherTranslatorInterface interface{}

type transactionFetcher struct {
	doneC      chan struct{}
	log        *zap.Logger
	queue      transactionFetcherQueueInterface
	translator transactionFetcherTranslatorInterface
}

func NewTransactionFetcher(queue transactionFetcherQueueInterface, translator transactionFetcherTranslatorInterface) *transactionFetcher {
	return &transactionFetcher{
		doneC:      make(chan struct{}),
		log:        logger.NewZapLogger("transaction_fetcher"),
		queue:      queue,
		translator: translator,
	}
}

func (f *transactionFetcher) Run() error {
	msgs, err := f.queue.Consume(app.QueueTransaction, "transaction_fetcher")
	if err != nil {
		f.log.Error(
			"failed to consume",
			zap.String("queue name", app.QueueTransaction),
			zap.String("consumer name", "transaction_fetcher"),
			zap.Error(err),
		)

		return err
	}

	for {
		select {
		case <-f.doneC:
			return nil
		case msg := <-msgs:
			f.log.Info(
				"received message",
				zap.String("queue name", app.QueueTransaction),
				zap.String("consumer name", "transaction_fetcher"),
				zap.String("message", string(msg.Body)),
			)
		}
	}
}

func (f *transactionFetcher) Stop(ctx context.Context) error {
	f.doneC <- struct{}{}
	return nil
}

func (f *transactionFetcher) Name() string {
	return "transaction_fetcher"
}
