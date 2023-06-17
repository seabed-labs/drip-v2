package translator

import (
	"context"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
)

func (t *Translator) EnqueueTransaction(ctx context.Context) error {
	// TODO Param
	return t.query.EnqueueTransaction(ctx, store.EnqueueTransactionParams{})
}

func (t *Translator) DequeueTransaction(ctx context.Context) error {
	// TODO id
	return t.query.DequeueTransaction(ctx, 0)
}

// TODO fix
func (t *Translator) ListAllQueuedTransactions(ctx context.Context) (any, error) {
	return t.query.ListAllQueuedTransactions(ctx)
}
