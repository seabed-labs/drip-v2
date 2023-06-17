package translator

import (
	"context"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
)

func (t *Translator) EnqueueAccount(ctx context.Context) error {
	// TODO Param
	return t.query.EnqueueAccount(ctx, store.EnqueueAccountParams{})
}

func (t *Translator) DequeueAccount(ctx context.Context) error {
	// TODO id
	return t.query.DequeueAccount(ctx, 0)
}

// TODO fix
func (t *Translator) ListAllQueuedAccount(ctx context.Context) (any, error) {
	return t.query.ListAllQueuedAccount(ctx)
}
