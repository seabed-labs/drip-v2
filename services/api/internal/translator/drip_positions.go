package translator

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/gen/fetcher"
	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func (t *Translator) InsertDripPosition(ctx context.Context, publicKey string, p *fetcher.DripPositionJSONWrapper) error {
	ownerTypeString := p.GetOwnerType()
	ownerType, ok, err := t.GetEnumByValue(ctx, ownerTypeString)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("invalid owner type: %s", ownerTypeString)
	}

	if ownerType == app.DirectOwner {
		_, ok, err = t.GetWalletByPublicKey(ctx, p.GetOwner())
		if err != nil {
			return err
		}

		if !ok {
			t.InsertWallet(ctx, p.GetOwner())
		}
	}

	t.query.InsertDripPosition(ctx, store.InsertDripPositionParams{
		PublicKey:                publicKey,
		GlobalConfig:             p.GetGlobalConfig(),
		Owner:                    sql.NullString{String: p.GetOwner(), Valid: true},
		OwnerType:                int64(ownerType),
		DripPositionSigner:       p.GetDripPositionSigner(),
		AutoCreditEnabled:        p.GetAutoCreditEnabled(),
		InputTokenMint:           p.GetInputTokenMint(),
		OutputTokenMint:          p.GetOutputTokenMint(),
		InputTokenAccount:        p.GetInputTokenAccount(),
		OutputTokenAccount:       p.GetOutputTokenAccount(),
		DripAmount:               p.GetDripAmount(),
		FrequencyInSeconds:       p.GetFrequencyInSeconds(),
		TotalInputTokenDripped:   p.GetTotalInputTokenDripped(),
		TotalOutputTokenReceived: p.GetTotalOutputTokenReceived(),
		DripPositionNftMint:      p.GetDripPositionNftMint(),
	})

	return nil
}

func (t *Translator) GetDripPosition(ctx context.Context) error {
	return nil
}
