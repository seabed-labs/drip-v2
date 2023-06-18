package translator

import (
	"database/sql"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func convStoreToAppQueuedAccount(sa store.DcafAccountQueue) *app.QueuedAccount {
	return &app.QueuedAccount{
		ID:          app.QueuedAccountID(sa.ID),
		PublicKey:   app.AccountPublicKey(sa.PublicKey),
		Priority:    sa.Priority,
		Attempts:    sa.Attempts,
		MaxAttempts: sa.Attempts,
		Time:        &sa.Time,
		RetryTime:   filterNullTime(sa.RetryTime),
	}
}

func convStoreToAppQueuedTransaction(stx store.DcafTxQueue) *app.QueuedTransaction {
	return &app.QueuedTransaction{
		ID:          app.QueuedTransactionID(stx.ID),
		Signature:   app.TransactionSignature(stx.Signature),
		Priority:    stx.Priority,
		Attempts:    stx.Attempts,
		MaxAttempts: stx.Attempts,
		Time:        &stx.Time,
		RetryTime:   filterNullTime(stx.RetryTime),
	}
}

func filterNullTime(t sql.NullTime) *time.Time {
	if t.Valid {
		return &t.Time
	}

	return nil
}
