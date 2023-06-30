package app

import (
	"encoding/json"
	"strconv"

	"github.com/dcaf-labs/drip-v2/services/api/gen/fetcher"
)

func decodeTransactionPayload(b []byte) (*Transaction, error) {
	tx := new(Transaction)

	return tx, json.Unmarshal(b, tx)
}

func decodeAccountPayload(b []byte) (*Account, error) {
	acc := new(Account)

	return acc, json.Unmarshal(b, acc)
}

func stringToInt64(s string) (int64, error) {
	return strconv.ParseInt(s, 10, 64)
}

func ConvFetcherToAppDripPosition(publicKey string, p *fetcher.DripPositionJSONWrapper) (*DripPosition, error) {
	var (
		err                        error
		dripFeeBps                 int64
		dripAmount                 int64
		dripAmountFilled           int64
		frequencyInSeconds         int64
		totalInputTokenDripped     int64
		totalOutputTokenReceived   int64
		dripActivationGenesisShift int64
		dripActivationTimestamp    int64
	)

	if dripFeeBps, err = stringToInt64(p.GetDripFeeBps()); err != nil {
		return nil, err
	}

	if dripAmount, err = stringToInt64(p.GetDripAmount()); err != nil {
		return nil, err
	}

	if dripAmountFilled, err = stringToInt64(p.GetDripAmountFilled()); err != nil {
		return nil, err
	}

	if frequencyInSeconds, err = stringToInt64(p.GetFrequencyInSeconds()); err != nil {
		return nil, err
	}

	if totalInputTokenDripped, err = stringToInt64(p.GetTotalInputTokenDripped()); err != nil {
		return nil, err
	}

	if totalOutputTokenReceived, err = stringToInt64(p.GetTotalOutputTokenReceived()); err != nil {
		return nil, err
	}

	if dripActivationGenesisShift, err = stringToInt64(p.GetDripActivationGenesisShift()); err != nil {
		return nil, err
	}

	if dripActivationTimestamp, err = stringToInt64(p.GetDripActivationTimestamp()); err != nil {
		return nil, err
	}

	return &DripPosition{
		PublicKey:                  publicKey,
		GlobalConfig:               p.GetGlobalConfig(),
		Owner:                      p.GetOwner(),
		OwnerType:                  p.GetOwnerType(),
		DripPositionSigner:         p.GetDripPositionSigner(),
		AutoCreditEnabled:          p.GetAutoCreditEnabled(),
		PairConfig:                 p.GetPairConfig(),
		InputTokenMint:             p.GetInputTokenMint(),
		OutputTokenMint:            p.GetOutputTokenMint(),
		InputTokenAccount:          p.GetInputTokenAccount(),
		OutputTokenAccount:         p.GetOutputTokenAccount(),
		DripFeeBps:                 dripFeeBps,
		DripAmount:                 dripAmount,
		DripAmountFilled:           dripAmountFilled,
		FrequencyInSeconds:         frequencyInSeconds,
		TotalInputTokenDripped:     totalInputTokenDripped,
		TotalOutputTokenReceived:   totalOutputTokenReceived,
		DripMaxJitter:              int64(p.GetDripMaxJitter()),
		DripActivationGenesisShift: dripActivationGenesisShift,
		DripActivationTimestamp:    dripActivationTimestamp,
		DripPositionNftMint:        p.GetDripPositionNftMint(),
	}, nil
}
