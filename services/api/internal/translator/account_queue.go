package translator

import (
	"context"
	"time"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func (t *Translator) EnqueueAccount(ctx context.Context, pub app.AccountPublicKey) error {
	return t.query.EnqueueAccount(ctx, store.EnqueueAccountParams{ // nolint: exhaustruct
		PublicKey:   string(pub),
		Priority:    3,
		Attempts:    0,
		MaxAttempts: 10,
		Time:        time.Now(),
	})
}

func (t *Translator) DequeueAccount(ctx context.Context, id app.QueuedAccountID) error {
	return t.query.DequeueAccount(ctx, int64(id))
}

func (t *Translator) ListAllQueuedAccount(ctx context.Context) ([]*app.QueuedAccount, error) {
	accs, err := t.query.ListAllQueuedAccount(ctx)
	if err != nil {
		return nil, err
	}

	var retAccs []*app.QueuedAccount
	for _, acc := range accs {
		retAccs = append(retAccs, convStoreToAppQueuedAccount(acc))
	}

	return retAccs, nil
}
