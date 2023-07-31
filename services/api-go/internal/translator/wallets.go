package translator

import (
	"context"
	"database/sql"
	"errors"
)

func (t *Translator) InsertWallet(ctx context.Context, publicKey string) error {
	return t.query.InsertWallet(ctx, publicKey)
}

func (t *Translator) GetWalletByPublicKey(ctx context.Context, publicKey string) (string, bool, error) {
	w, err := t.query.GetWalletByPublicKey(ctx, publicKey)
	if errors.Is(err, sql.ErrNoRows) {
		return "", false, nil
	}

	if err != nil {
		return "", false, err
	}

	return w.PublicKey, true, nil
}
