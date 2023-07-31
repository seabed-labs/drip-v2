-- name: InsertDripPosition :exec
INSERT INTO dcaf."drip_positions" (
  "public_key",
  "global_config",
  "owner",
  "owner_type",
  "drip_position_signer",
  "auto_credit_enabled",
  "pair_config",
  "input_token_mint",
  "output_token_mint",
  "input_token_account",
  "output_token_account",
  "drip_fee_bps",
  "drip_amount",
  "drip_amount_filled",
  "frequency_in_seconds",
  "total_input_token_dripped",
  "total_output_token_received",
  "drip_max_jitter",
  "drip_activation_genesis_shift",
  "drip_activation_timestamp",
  "drip_position_nft_mint"
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
);

-- name: GetDripPositionByWalletPublicKey :many
SELECT
  p."id",
  p."public_key",
  p."global_config",
  p."owner",
  p."owner_type",
  p."drip_fee_bps",
  p."drip_position_signer",
  p."auto_credit_enabled",
  p."pair_config",
  p."input_token_mint",
  p."output_token_mint",
  p."input_token_account",
  p."output_token_account",
  p."drip_amount",
  p."drip_amount_filled",
  p."frequency_in_seconds",
  p."total_input_token_dripped",
  p."total_output_token_received",
  p."drip_max_jitter",
  p."drip_activation_genesis_shift",
  p."drip_activation_timestamp",
  p."drip_position_nft_mint"
FROM dcaf."drip_positions" AS p
INNER JOIN dcaf."wallets" AS w
  ON p."owner" = w."public_key"
WHERE w."public_key" = $1;
