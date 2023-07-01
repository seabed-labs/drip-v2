package translator

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/dcaf-labs/drip-v2/services/api/gen/store"
	"github.com/dcaf-labs/drip-v2/services/api/internal/app"
)

func (t *Translator) InsertDripPosition(ctx context.Context, p *app.DripPosition) error {
	ownerType, ok, err := t.GetEnumByValue(ctx, p.OwnerType)
	if err != nil {
		return err
	}

	if !ok {
		return fmt.Errorf("invalid owner type: %s", p.OwnerType)
	}

	if ownerType == app.DirectOwner {
		_, ok, err = t.GetWalletByPublicKey(ctx, p.OwnerType)
		if err != nil {
			return err
		}

		if !ok {
			if err = t.InsertWallet(ctx, p.Owner); err != nil {
				return err
			}
		}
	}

	return t.query.InsertDripPosition(ctx, store.InsertDripPositionParams{
		PublicKey:                  p.PublicKey,
		GlobalConfig:               p.GlobalConfig,
		Owner:                      sql.NullString{String: p.Owner, Valid: true},
		OwnerType:                  int64(ownerType),
		DripPositionSigner:         p.DripPositionSigner,
		AutoCreditEnabled:          p.AutoCreditEnabled,
		PairConfig:                 p.PairConfig,
		InputTokenMint:             p.InputTokenMint,
		OutputTokenMint:            p.OutputTokenMint,
		InputTokenAccount:          p.InputTokenAccount,
		OutputTokenAccount:         p.OutputTokenAccount,
		DripFeeBps:                 p.DripFeeBps,
		DripAmount:                 p.DripAmount,
		DripAmountFilled:           p.DripAmountFilled,
		FrequencyInSeconds:         p.FrequencyInSeconds,
		TotalInputTokenDripped:     p.TotalInputTokenDripped,
		TotalOutputTokenReceived:   p.TotalOutputTokenReceived,
		DripMaxJitter:              p.DripMaxJitter,
		DripActivationGenesisShift: p.DripActivationGenesisShift,
		DripActivationTimestamp:    p.DripActivationTimestamp,
		DripPositionNftMint:        sql.NullString{String: p.DripPositionNftMint, Valid: true},
	})
}

func (t *Translator) GetDripPositions(ctx context.Context, publicKey string) ([]*app.DripPosition, error) {
	ps, err := t.query.GetDripPositionByWalletPublicKey(ctx, publicKey)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	var retPs []*app.DripPosition
	for _, p := range ps {
		e, err := t.query.GetEnumByID(ctx, p.OwnerType)
		if errors.Is(err, sql.ErrNoRows) {
			return nil, fmt.Errorf("owner type not found: %d", p.OwnerType)
		}

		if err != nil {
			return nil, err
		}

		var (
			owner               string
			dripPositionNftMint string
		)
		if p.Owner.Valid {
			owner = p.Owner.String
		}

		if p.Owner.Valid {
			dripPositionNftMint = p.DripPositionNftMint.String
		}

		retPs = append(retPs, &app.DripPosition{
			PublicKey:                  p.PublicKey,
			GlobalConfig:               p.GlobalConfig,
			Owner:                      owner,
			OwnerType:                  e.Value,
			DripPositionSigner:         p.DripPositionSigner,
			AutoCreditEnabled:          p.AutoCreditEnabled,
			PairConfig:                 p.PairConfig,
			InputTokenMint:             p.InputTokenMint,
			OutputTokenMint:            p.OutputTokenMint,
			InputTokenAccount:          p.InputTokenAccount,
			OutputTokenAccount:         p.OutputTokenAccount,
			DripFeeBps:                 p.DripFeeBps,
			DripAmount:                 p.DripAmount,
			DripAmountFilled:           p.DripAmountFilled,
			FrequencyInSeconds:         p.FrequencyInSeconds,
			TotalInputTokenDripped:     p.TotalInputTokenDripped,
			TotalOutputTokenReceived:   p.TotalOutputTokenReceived,
			DripMaxJitter:              p.DripMaxJitter,
			DripActivationGenesisShift: p.DripActivationGenesisShift,
			DripActivationTimestamp:    p.DripActivationTimestamp,
			DripPositionNftMint:        dripPositionNftMint,
		})
	}

	return retPs, nil
}
