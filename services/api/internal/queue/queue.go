package queue

import (
	"fmt"

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

	rabbitMQAddress := fmt.Sprintf("amqp://%s:%s@%s:%d", o.user, o.password, host, port)

	conn, err := amqp.Dial(rabbitMQAddress)
	if err != nil {
		log.Fatal(
			"failed to connect to rabbitMQ",
			zap.String("address", rabbitMQAddress),
			zap.Error(err),
		)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal(
			"failed to open rabbitMQ channel",
			zap.String("address", rabbitMQAddress),
			zap.Error(err),
		)
	}

	return &rabbitMQ{
		log:        log,
		connection: conn,
		channel:    ch,
	}
}

func (r *rabbitMQ) Close() {
	if err := r.channel.Close(); err != nil {
		r.log.Error(
			"failed to gracefully close rabbitMQ channel",
			zap.String("address", r.address),
			zap.Error(err),
		)
	}

	if err := r.connection.Close(); err != nil {
		r.log.Error(
			"failed to gracefully close rabbitMQ connection",
			zap.String("address", r.address),
			zap.Error(err),
		)
	}
}

func (r *rabbitMQ) DeclareQueue(names ...string) error {
	for _, name := range names {
		if _, err := r.channel.QueueDeclare(name, true, false, false, false, nil); err != nil {
			r.log.Fatal(
				"failed to create queue",
				zap.String("name", name),
				zap.Error(err),
			)
		}
	}

	return nil
}

func (r *rabbitMQ) Publish(queueName, contentType, body string) error {
	return r.channel.Publish("", queueName, false, false,
		amqp.Publishing{
			ContentType: contentType,
			Body:        []byte(body),
		},
	)
}
