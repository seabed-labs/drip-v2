-- name: InsertDripPosition :exec
INSERT INTO dcaf."drip_positions" (
  "public_key",
  "global_config",
  "owner",
  "owner_type",
  "drip_position_signer",
  "auto_credit_enabled",
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
  $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
);
