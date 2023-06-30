package app

type Queue string
type Owner int64

const (
	TransactionQueue Queue = "transaction"
	AccountQueue     Queue = "account"
)

const (
	DirectOwner    Owner = 1
	TokenizedOwner Owner = 2
)

type (
	TransactionSignature string
	AccountPublicKey     string
)

type Transaction struct {
	Signature TransactionSignature `json:"tx_signature"`
}

type Account struct {
	PublicKey AccountPublicKey `json:"acc_publicKey"`
}

type DripPosition struct {
	PublicKey                  string `json:"public_key,omitempty"`
	GlobalConfig               string `json:"global_config,omitempty"`
	Owner                      string `json:"owner,omitempty"`
	OwnerType                  string `json:"owner_type,omitempty"`
	DripPositionSigner         string `json:"drip_position_signer,omitempty"`
	AutoCreditEnabled          bool   `json:"auto_credit_enabled,omitempty"`
	InputTokenMint             string `json:"input_token_mint,omitempty"`
	OutputTokenMint            string `json:"output_token_mint,omitempty"`
	InputTokenAccount          string `json:"input_token_account,omitempty"`
	OutputTokenAccount         string `json:"output_token_account,omitempty"`
	DripFeeBps                 int64  `json:"drip_fee_bps,omitempty"`
	DripAmount                 int64  `json:"drip_amount,omitempty"`
	DripAmountFilled           int64  `json:"drip_amount_filled,omitempty"`
	FrequencyInSeconds         int64  `json:"frequency_in_seconds,omitempty"`
	TotalInputTokenDripped     int64  `json:"total_input_token_dripped,omitempty"`
	TotalOutputTokenReceived   int64  `json:"total_output_token_received,omitempty"`
	DripMaxJitter              int64  `json:"drip_max_jitter,omitempty"`
	DripActivationGenesisShift int64  `json:"drip_activation_genesis_shift,omitempty"`
	DripActivationTimestamp    int64  `json:"drip_activation_timestamp,omitempty"`
	DripPositionNftMint        string `json:"drip_position_nft_mint,omitempty"`
}
