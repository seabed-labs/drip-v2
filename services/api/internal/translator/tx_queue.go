package translator

import (
	"context"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func (t *Translator) EnqueueTransaction(ctx context.Context, txSignature app.TransactionSignature) error {
	return t.query.EnqueueTransaction(ctx, store.EnqueueTransactionParams{ // nolint: exhaustruct
		Signature:   string(txSignature),
		Priority:    3,
		Attempts:    0,
		MaxAttempts: 10,
		Time:        time.Now(),
	})
}

func (t *Translator) DequeueTransaction(ctx context.Context, id app.QueuedTransactionID) error {
	return t.query.DequeueTransaction(ctx, int64(id))
}

func (t *Translator) ListAllQueuedTransactions(ctx context.Context) ([]*app.QueuedTransaction, error) {
	txs, err := t.query.ListAllQueuedTransactions(ctx)
	if err != nil {
		return nil, err
	}

	var retTxs []*app.QueuedTransaction
	for _, tx := range txs {
		retTxs = append(retTxs, convStoreToAppQueuedTransaction(tx))
	}

	return retTxs, nil
}
