package runnable

import (
	"context"
	"fmt"
	"net/http"

	"github.com/dcaf-labs/drip-v2/services/api/gen/fetcher"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type accountConsumerQueueInterface interface {
	Consume(queue app.Queue, consumer string) (<-chan amqp.Delivery, error)
}

type accountConsumerTranslatorInterface interface{}

type accountConsumer struct {
	doneC      chan struct{}
	log        *zap.Logger
	name       string
	qName      app.Queue
	queue      accountConsumerQueueInterface
	translator accountConsumerTranslatorInterface
	fetcher    *fetcher.APIClient
}

func NewAccountConsumer(
	queue accountConsumerQueueInterface,
	translator accountConsumerTranslatorInterface,
	fetcher *fetcher.APIClient,
) *accountConsumer {
	qName := app.AccountQueue
	name := fmt.Sprintf("%s_consumer", qName)

	return &accountConsumer{
		doneC:      make(chan struct{}),
		log:        logger.NewZapLogger(name),
		name:       name,
		qName:      qName,
		queue:      queue,
		translator: translator,
		fetcher:    fetcher,
	}
}

func (c *accountConsumer) Run() error {
	ctx := context.Background()

	msgs, err := c.queue.Consume(c.qName, c.name)
	if err != nil {
		c.log.Error(
			"failed to consume",
			zap.String("queue name", string(c.qName)),
			zap.String("consumer name", c.name),
			zap.Error(err),
		)

		return err
	}

	for {
		select {
		case <-c.doneC:
			return nil
		case msg := <-msgs:
			c.log.Info(
				"received message",
				zap.String("queue name", string(c.qName)),
				zap.String("consumer name", c.name),
				zap.String("message", string(msg.Body)),
			)

			acc, resp, err := c.fetcher.DefaultAPI.ParseAccount(ctx, string(msg.Body)).Execute()
			if err != nil || resp.StatusCode != http.StatusOK {
				c.log.Error(
					"failed to get parsed account",
					zap.String("queue name", string(c.qName)),
					zap.String("consumer name", c.name),
					zap.String("message", string(msg.Body)),
				)
			}

			switch {
			case acc.ParsedDripPosition != nil:
			case acc.ParsedDripPositionNftMapping != nil:
			case acc.ParsedDripPositionSigner != nil:
			case acc.ParsedGlobalConfig != nil:
			case acc.ParsedGlobalConfigSigner != nil:
			case acc.ParsedPairConfig != nil:
			}

			//c.translator.CreateAccount(acc)
		}
	}
}

func (c *accountConsumer) Stop(ctx context.Context) error {
	c.doneC <- struct{}{}
	return nil
}

func (c *accountConsumer) Name() string {
	return c.name
}
