package runnable

import (
	"context"
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/fetcher"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type transactionConsumerQueueInterface interface {
	Consume(queue app.Queue, consumer string) (<-chan amqp.Delivery, error)
}

type transactionConsumerTranslatorInterface interface{}

type consumer struct {
	doneC      chan struct{}
	log        *zap.Logger
	name       string
	qName      app.Queue
	queue      transactionConsumerQueueInterface
	translator transactionConsumerTranslatorInterface
	client     fetcher.ClientInterface
}

func NewTransactionConsumer(
	queue transactionConsumerQueueInterface,
	translator transactionConsumerTranslatorInterface,
	client fetcher.ClientInterface,
) *consumer {
	qName := app.TransactionQueue
	name := fmt.Sprintf("%s_consumer", qName)

	return &consumer{
		doneC:      make(chan struct{}),
		log:        logger.NewZapLogger(name),
		name:       name,
		qName:      qName,
		queue:      queue,
		translator: translator,
		client:     client,
	}
}

func (c *consumer) Run() error {
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
		}
	}
}

func (c *consumer) Stop(ctx context.Context) error {
	c.doneC <- struct{}{}
	return nil
}

func (c *consumer) Name() string {
	return c.name
}
