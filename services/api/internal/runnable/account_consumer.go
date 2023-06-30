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

type accountConsumerTranslatorInterface interface {
	InsertDripPosition(ctx context.Context, p *app.DripPosition) error
}

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
			ping, resp, err := c.fetcher.DefaultAPI.PingExecute(c.fetcher.DefaultAPI.Ping(ctx))
			if err != nil || resp.StatusCode != http.StatusOK || ping == nil {
				c.log.Fatal("failed to ping fetcher")

				continue
			}

			accPubKey := string(msg.Body)
			acc, resp, err := c.fetcher.DefaultAPI.ParseAccountExecute(c.fetcher.DefaultAPI.ParseAccount(ctx, string(msg.Body)))
			if err != nil || resp.StatusCode != http.StatusOK || acc == nil {
				c.log.Error(
					"failed to get parsed account",
					zap.String("queue name", string(c.qName)),
					zap.String("consumer name", c.name),
					zap.String("account public key", accPubKey),
					zap.Error(err),
				)

				continue
			}

			switch {
			case acc.ParsedDripPosition != nil:
				p, err := app.ConvFetcherToAppDripPosition(acc.PublicKey, acc.ParsedDripPosition)
				if err != nil {
					c.log.Error(
						"failed to convert fetcher to app DripPosition",
						zap.Error(err),
					)
				}

				c.translator.InsertDripPosition(ctx, p)
			case acc.ParsedDripPositionNftMapping != nil:
			case acc.ParsedDripPositionSigner != nil:
			case acc.ParsedGlobalConfig != nil:
			case acc.ParsedGlobalConfigSigner != nil:
			case acc.ParsedPairConfig != nil:
			default:
				c.log.Error(
					"account not supported",
					zap.String("queue name", string(c.qName)),
					zap.String("consumer name", c.name),
					zap.String("account public key", accPubKey),
					zap.Error(err),
				)
			}
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
