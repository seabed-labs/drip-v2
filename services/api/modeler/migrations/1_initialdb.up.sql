CREATE SCHEMA IF NOT EXISTS dcaf;

CREATE TABLE dcaf."wallets" (
  "id" bigserial NOT NULL,
  "public_key" VARCHAR(44) NOT NULL,
  CONSTRAINT "wallets_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_public_key" UNIQUE ("public_key")
);

CREATE TABLE dcaf."drip_positions_enums" (
  "id" bigserial NOT NULL,
  "value" text NOT NULL,
  CONSTRAINT "drip_positions_enums_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_value" UNIQUE ("value")
);

CREATE TABLE dcaf."drip_positions" (
  "id" bigserial NOT NULL,
  "public_key" VARCHAR(44) NOT NULL,
  "global_config" VARCHAR(44) NOT NULL,
  "owner" VARCHAR(44),
  "owner_type" bigint NOT NULL,
  "drip_position_signer" VARCHAR(44) NOT NULL,
  "auto_credit_enabled" boolean NOT NULL,
  "input_token_mint" VARCHAR(44) NOT NULL,
  "output_token_mint" VARCHAR(44) NOT NULL,
  "input_token_account" VARCHAR(44) NOT NULL,
  "output_token_account" VARCHAR(44) NOT NULL,
  "drip_fee_bps" bigint NOT NULL,
  "drip_amount" bigint NOT NULL,
  "drip_amount_filled" bigint NOT NULL,
  "frequency_in_seconds" bigint NOT NULL,
  "total_input_token_dripped" bigint NOT NULL,
  "total_output_token_received" bigint NOT NULL,
  "drip_max_jitter" VARCHAR(44),
  "drip_activation_genesis_shift" VARCHAR(44),
  "drip_activation_timestamp" VARCHAR(44),
  "drip_position_nft_mint" VARCHAR(44),
  CONSTRAINT "drip_positions_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_public_key" UNIQUE ("public_key")
);
