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

type transactionConsumerQueueInterface interface {
	Consume(queue app.Queue, consumer string) (<-chan amqp.Delivery, error)
}

type transactionConsumerTranslatorInterface interface{}

type transactionConsumer struct {
	doneC      chan struct{}
	log        *zap.Logger
	name       string
	qName      app.Queue
	queue      transactionConsumerQueueInterface
	translator transactionConsumerTranslatorInterface
	fetcher    *fetcher.APIClient
}

func NewTransactionConsumer(
	queue transactionConsumerQueueInterface,
	translator transactionConsumerTranslatorInterface,
	fetcher *fetcher.APIClient,
) *transactionConsumer {
	qName := app.TransactionQueue
	name := fmt.Sprintf("%s_consumer", qName)

	return &transactionConsumer{
		doneC:      make(chan struct{}),
		log:        logger.NewZapLogger(name),
		name:       name,
		qName:      qName,
		queue:      queue,
		translator: translator,
		fetcher:    fetcher,
	}
}

func (c *transactionConsumer) Run() error {
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
			c.log.Debug(
				"received message",
				zap.String("queue name", string(c.qName)),
				zap.String("consumer name", c.name),
				zap.String("message", string(msg.Body)),
			)

			txs, resp, err := c.fetcher.DefaultAPI.ParseTx(ctx, string(msg.Body)).Execute()
			if err != nil || resp.StatusCode != http.StatusOK {
				c.log.Error(
					"failed to get parsed account",
					zap.String("queue name", string(c.qName)),
					zap.String("consumer name", c.name),
					zap.String("message", string(msg.Body)),
				)
			}

			for _, ix := range txs.Instructions {
				switch {
				case ix.ParsedDeposit != nil:
				case ix.ParsedDetokenizeDripPosition != nil:
				case ix.ParsedInitDripPosition != nil:
				case ix.ParsedInitDripPositionNft != nil:
				case ix.ParsedInitGlobalConfig != nil:
				case ix.ParsedInitPairConfig != nil:
				case ix.ParsedToggleAutoCredit != nil:
				case ix.ParsedTokenizeDripPosition != nil:
				case ix.ParsedUpdateAdmin != nil:
				case ix.ParsedUpdateDefaultDripFees != nil:
				case ix.ParsedUpdateDefaultPairDripFees != nil:
				case ix.ParsedUpdatePythPriceFeed != nil:
				case ix.ParsedUpdateSuperAdmin != nil:
				}
			}

			//c.translator.CreateTransaction(tx)
		}
	}
}

func (c *transactionConsumer) Stop(ctx context.Context) error {
	c.doneC <- struct{}{}
	return nil
}

func (c *transactionConsumer) Name() string {
	return c.name
}
