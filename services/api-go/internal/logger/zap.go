package logger

import (
	"log"

	"go.uber.org/zap"
)

func NewZapLogger(name string) *zap.Logger {
	l, err := zap.NewProduction()
	if err != nil {
		log.Fatalf("failed to create zap logger: %s", err.Error())
	}

	return l.Named(name)
}
