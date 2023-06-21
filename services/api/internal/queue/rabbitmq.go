package queue

import (
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type rabbitMQ struct {
	log        *zap.Logger
	address    string
	connection *amqp.Connection
	channel    *amqp.Channel
}

type rabbitMQOption struct {
	user     string
	password string
}

type rabbitMQOptionFunc func(*rabbitMQOption)

func WithRabbitMQUser(user string) rabbitMQOptionFunc {
	return func(o *rabbitMQOption) {
		o.user = user
	}
}

func WithRabbitMQPassword(password string) rabbitMQOptionFunc {
	return func(o *rabbitMQOption) {
		o.password = password
	}
}

func NewRabbitMQ(host string, port int64, opts ...rabbitMQOptionFunc) *rabbitMQ {
	o := &rabbitMQOption{
		user:     "guest",
		password: "guest",
	}

	for _, opt := range opts {
		opt(o)
	}

	log := logger.NewZapLogger("rabbitMQ")

	log.Info(
		"connecting to rabbitMQ",
		zap.String("host", host),
		zap.Int64("port", port),
	)

	address := fmt.Sprintf("amqp://%s:%s@%s:%d", o.user, o.password, host, port)

	conn, err := amqp.Dial(address)
	if err != nil {
		log.Fatal(
			"failed to connect to rabbitMQ",
			zap.String("address", address),
			zap.Error(err),
		)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(
			"failed to open rabbitMQ channel",
			zap.String("address", address),
			zap.Error(err),
		)
	}

	return &rabbitMQ{
		log:        log,
		address:    address,
		connection: conn,
		channel:    ch,
	}
}

func (q *rabbitMQ) Close() {
	if err := q.channel.Close(); err != nil {
		q.log.Error(
			"failed to gracefully close rabbitMQ channel",
			zap.String("address", q.address),
			zap.Error(err),
		)
	}

	if err := q.connection.Close(); err != nil {
		q.log.Error(
			"failed to gracefully close rabbitMQ connection",
			zap.String("address", q.address),
			zap.Error(err),
		)
	}
}

func (q *rabbitMQ) DeclareQueue(queues ...app.Queue) {
	for _, queue := range queues {
		if _, err := q.channel.QueueDeclare(string(queue), true, false, false, false, nil); err != nil {
			q.log.Fatal(
				"failed to create queue",
				zap.String("name", string(queue)),
				zap.Error(err),
			)
		}
	}
}

func (q *rabbitMQ) Publish(queue app.Queue, contentType, body string) error {
	return q.channel.Publish("", string(queue), false, false,
		amqp.Publishing{ // nolint: exhaustruct
			ContentType: contentType,
			Body:        []byte(body),
		},
	)
}

func (q *rabbitMQ) Consume(queue app.Queue, consumer string) (<-chan amqp.Delivery, error) {
	return q.channel.Consume(string(queue), consumer, true, false, false, false, nil)
}
