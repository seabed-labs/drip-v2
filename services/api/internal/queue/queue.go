package queue

import (
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"github.com/streadway/amqp"
	"go.uber.org/zap"
)

type rabbitMQ struct {
	log     *zap.Logger
	address string
	rmq     *amqp.Connection
	rch     *amqp.Channel
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

	rmq, err := amqp.Dial(rabbitMQAddress)
	if err != nil {
		log.Fatal(
			"failed to connect to rabbitMQ",
			zap.String("address", rabbitMQAddress),
			zap.Error(err),
		)
	}

	rch, err := rmq.Channel()
	if err != nil {
		log.Fatal(
			"failed to open rabbitMQ channel",
			zap.String("address", rabbitMQAddress),
			zap.Error(err),
		)
	}

	return &rabbitMQ{
		log: log,
		rmq: rmq,
		rch: rch,
	}
}

func (r *rabbitMQ) Close() {
	if err := r.rch.Close(); err != nil {
		r.log.Error(
			"failed to gracefully close rabbitMQ channel",
			zap.String("address", r.address),
			zap.Error(err),
		)
	}

	if err := r.rmq.Close(); err != nil {
		r.log.Error(
			"failed to gracefully close rabbitMQ connection",
			zap.String("address", r.address),
			zap.Error(err),
		)
	}
}
