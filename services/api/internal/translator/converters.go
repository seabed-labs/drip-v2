package translator

import (
	"database/sql"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func convStoreToAppQueuedAccount(sa store.DcafAccountQueue) (*app.QueuedAccount, error) {
	return &app.QueuedAccount{
		ID:          app.QueuedAccountID(sa.ID),
		PublicKey:   app.PublicKey(sa.PublicKey),
		Priority:    sa.Priority,
		Attempts:    sa.Attempts,
		MaxAttempts: sa.Attempts,
		Time:        &sa.Time,
		RetryTime:   filterNullTime(sa.RetryTime),
	}, nil
}

func convStoreToAppQueuedTransaction(stx store.DcafTxQueue) (*app.QueuedTransaction, error) {
	return &app.QueuedTransaction{
		ID:                   app.QueuedTransactionID(stx.ID),
		TransactionSignature: app.TransactionSignature(stx.TxSignature),
		Priority:             stx.Priority,
		Attempts:             stx.Attempts,
		MaxAttempts:          stx.Attempts,
		Time:                 &stx.Time,
		RetryTime:            filterNullTime(stx.RetryTime),
	}, nil

}

func filterNullTime(t sql.NullTime) *time.Time {
	var tt *time.Time
	if t.Valid {
		tt = &t.Time
	}

	return tt
}
