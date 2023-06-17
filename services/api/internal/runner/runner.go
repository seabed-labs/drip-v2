package runner

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type Runnable interface {
	Run() error
	Stop(ctx context.Context) error
	Name() string
}

type Runner struct {
	log       *zap.Logger
	stop      chan os.Signal
	wait      chan interface{}
	runnables []Runnable
}

func NewRunner(runnables ...Runnable) *Runner {
	r := &Runner{
		log:       logger.NewZapLogger("runner"),
		stop:      make(chan os.Signal, 1),
		wait:      make(chan interface{}, 1),
		runnables: runnables,
	}
	signal.Notify(r.stop, syscall.SIGINT, syscall.SIGTERM)

	return r
}

func (r *Runner) Run() *Runner {
	for _, e := range r.runnables {
		go func(e Runnable) {
			r.log.Info(
				"runner initiated",
				zap.String("name", e.Name()),
			)

			if err := e.Run(); err != nil {
				r.log.Fatal(
					"runner failed during run",
					zap.String("name", e.Name()),
					zap.Error(err),
				)
			}
		}(e)
	}

	return r
}

func (r *Runner) Stop() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	for _, e := range r.runnables {
		r.log.Info(
			"runner stopping",
			zap.String("name", e.Name()),
		)

		if err := e.Stop(ctx); err != nil {
			r.log.Fatal(
				"runner failed during stop",
				zap.String("name", e.Name()),
				zap.Error(err),
			)
		}

		r.log.Info(
			"runner stopped",
			zap.String("name", e.Name()),
		)
	}
}

func (r *Runner) ThenStop() {
	<-r.stop
	r.Stop()
}
