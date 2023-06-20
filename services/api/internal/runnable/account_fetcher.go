package runnable

import (
	"context"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type accountFetcherQueueInterface interface {
	Consume(name, consumer string) (<-chan amqp.Delivery, error)
}

type accountFetcherTranslatorInterface interface{}

type accountFetcher struct {
	doneC      chan struct{}
	log        *zap.Logger
	queue      accountFetcherQueueInterface
	translator accountFetcherTranslatorInterface
}

func NewAccountFetcher(queue accountFetcherQueueInterface, translator accountFetcherTranslatorInterface) *accountFetcher {
	return &accountFetcher{
		doneC:      make(chan struct{}),
		log:        logger.NewZapLogger("account_fetcher"),
		queue:      queue,
		translator: translator,
	}
}

func (f *accountFetcher) Run() error {
	msgs, err := f.queue.Consume(app.QueueAccount, "account_fetcher")
	if err != nil {
		f.log.Error(
			"failed to consume",
			zap.String("queue name", app.QueueAccount),
			zap.String("consumer name", "account_fetcher"),
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
				zap.String("queue name", app.QueueAccount),
				zap.String("consumer name", "account_fetcher"),
				zap.String("message", string(msg.Body)),
			)
		}
	}
}

func (f *accountFetcher) Stop(ctx context.Context) error {
	f.doneC <- struct{}{}
	return nil
}

func (f *accountFetcher) Name() string {
	return "account_fetcher"
}
