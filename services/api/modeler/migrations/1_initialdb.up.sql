CREATE SCHEMA IF NOT EXISTS dcaf;

CREATE TABLE dcaf."wallet" (
  "id" bigserial NOT NULL,
  "public_key" VARCHAR(44) NOT NULL,
  CONSTRAINT "wallet_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_public_key" UNIQUE ("public_key"),
)

CREATE TABLE dcaf."drip_position_enums" (
  "id" bigserial NOT NULL,
  "enum" text NOT NULL,
  CONSTRAINT "drip_position_enums_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_enum" UNIQUE ("enum"),
)

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
  "drip_amount" bigint NOT NULL,
  "frequency_in_seconds" bigint NOT NULL,
  "total_input_token_dripped" bigint NOT NULL,
  "total_output_token_received" bigint NOT NULL,
  "drip_position_nft_mint" VARCHAR(44),
  CONSTRAINT "drip_position_pk" PRIMARY KEY ("id"),
  CONSTRAINT "unique_public_key" UNIQUE ("public_key"),
);
