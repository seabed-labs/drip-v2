package translator

import (
	"database/sql"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/logger"
	"go.uber.org/zap"
)

type Translator struct {
	log   *zap.Logger
	db    *sql.DB
	query *store.Queries
}

func NewTranslator(db *sql.DB) *Translator {
	return &Translator{
		log:   logger.NewZapLogger("translator"),
		db:    db,
		query: store.New(db),
	}
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
		} else {
			opErr = tx.Commit()
		}

		if opErr != nil {
			err = opErr
		}
	}()

	err = fn(tx)
	return err
}
