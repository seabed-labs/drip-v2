package runnable

import (
	"context"
	"fmt"

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
}

func NewAccountConsumer(
	queue accountConsumerQueueInterface,
	translator accountConsumerTranslatorInterface,
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
	}
}

func (c *accountConsumer) Run() error {
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
