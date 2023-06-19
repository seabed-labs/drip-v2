package translator

import (
	"database/sql"
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type Translator struct {
	log     *zap.Logger
	address string
	db      *sql.DB
	query   *store.Queries
}

type translatorOption struct {
	user     string
	password string
	sslMode  string
}

type translatorOptionFunc func(*translatorOption)

func WithDatabaseUser(user string) translatorOptionFunc {
	return func(o *translatorOption) {
		o.user = user
	}
}

func WithDatabasePassword(password string) translatorOptionFunc {
	return func(o *translatorOption) {
		o.password = password
	}
}

func WithDatabaseSSLMode(sslMode string) translatorOptionFunc {
	return func(o *translatorOption) {
		o.sslMode = sslMode
	}
}

func NewTranslator(driverName, name, host string, port int64, opts ...translatorOptionFunc) *Translator {
	o := &translatorOption{}

	for _, opt := range opts {
		opt(o)
	}

	log := logger.NewZapLogger("translator")
	log.Info(
		"connecting to database",
		zap.String("name", name),
		zap.String("host", host),
		zap.Int64("port", port),
	)

	address := fmt.Sprintf(
		"user=%s password=%s host=%s port=%d dbname=%s sslmode=%s",
		o.user,
		o.password,
		host,
		port,
		name,
		o.sslMode,
	)
	db, err := sql.Open(driverName, address)
	if err != nil {
		log.Fatal(
			"failed to connect to the database",
			zap.String("address", address),
			zap.Error(err),
		)
	}

	if err = db.Ping(); err != nil {
		log.Fatal(
			"failed to ping the database",
			zap.String("address", address),
			zap.Error(err),
		)
	}

	return &Translator{
		log:     log,
		address: address,
		db:      db,
		query:   store.New(db),
	}
}

func (t *Translator) Close() {
	t.db.Close()
}

func (t *Translator) CommitTransactor(fn func(tx *sql.Tx) error) (err error) {
	tx, err := t.db.Begin()
	if err != nil {
		return err
	}

	defer func() {
		var opErr error
		if p := recover(); p != nil {
			opErr = tx.Rollback()
			err = opErr
			panic(p)
		} else if err != nil {
			opErr = tx.Rollback()
			t.log.Error(
				"error occurred! rolling back.",
				zap.Error(opErr),
			)
		} else {
			opErr = tx.Commit()
		}

		if opErr != nil {
			err = opErr
		}
	}()

	// DO NOT REMOVE
	err = fn(tx)

	return err
}
