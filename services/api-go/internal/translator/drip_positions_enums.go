package translator

import (
	"context"
	"database/sql"
	"errors"

	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func (t *Translator) GetEnumByValue(ctx context.Context, val string) (app.Owner, bool, error) {
	e, err := t.query.GetEnumByValue(ctx, val)
	if errors.Is(err, sql.ErrNoRows) {
		return -1, false, nil
	}

	if err != nil {
		return -1, false, err
	}

	return app.Owner(e.ID), true, nil
}
