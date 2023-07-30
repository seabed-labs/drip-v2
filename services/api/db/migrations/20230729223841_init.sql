-- migrate:up
CREATE TABLE "global_config" (
  "public_key" varchar(44) PRIMARY KEY,
  "version" int NOT NULL,
  "super_admin" varchar(44) NOT NULL,
  "admins" varchar(44)[] NOT NULL,
  "admin_permissions" numeric[] NOT NULL,
  "default_drip_fee_bps" int NOT NULL,
  "global_config_signer" varchar(44) NOT NULL
);

CREATE TABLE "global_config_signer" (
    "public_key" varchar(44) PRIMARY KEY,
    "version" int NOT NULL,
    "global_config" varchar(44) NOT NULL,
    "bump" int NOT NULL
);

CREATE TABLE "pair_config" (
    "public_key" varchar(44) PRIMARY KEY,
    "global_config" varchar(44) NOT NULL,
    "input_token_mint" varchar(44) NOT NULL,
    "output_token_mint" varchar(44) NOT NULL,
    "bump" int NOT NULL,
    "default_drip_fee_bps" int NOT NULL
);

CREATE TABLE "drip_position_signer" (
    "public_key" varchar(44) PRIMARY KEY,
    "drip_position" varchar(44) NOT NULL,
    "version" int NOT NULL,
    "bump" int NOT NULL
);

CREATE TABLE "drip_position_nft_mapping" (
    "public_key" varchar(44) PRIMARY KEY,
    "drip_position_nft_mint" varchar(44) NOT NULL,
    "drip_position" varchar(44) NOT NULL,
    "bump" int NOT NULL
);

CREATE TYPE owner_kind as ENUM ('DIRECT', 'TOKENIZED');

CREATE TABLE "drip_position" (
    "public_key" varchar(44) PRIMARY KEY,
    "global_config" varchar(44) NOT NULL,
    "pair_config" varchar(44) NOT NULL,
    "input_token_account" varchar(44) NOT NULL,
    "output_token_account" varchar(33) NOT NULL,
    "owner_value" varchar(44) NOT NULL,
    "owner_kind" owner_kind NOT NULL,
    "drip_amount_pre_fees" numeric NOT NULL,
    "max_slippage_bps" int NOT NULL,
    "max_price_deviation_bps" int NOT NULL,
    "drip_fee_bps" int NOT NULL,
    "drip_position_nft_mint" varchar(44),
    "auto_credit_enabled" boolean NOT NULL,
    "drip_amount_remaining_post_fees_in_current_cycle" numeric NOT NULL,
    "drip_input_fees_remaining_for_current_cycle" numeric NOT NULL,
    "total_input_fees_collected" numeric NOT NULL,
    "total_output_fees_collected" numeric NOT NULL,
    "total_input_token_DrippedPostFees" numeric NOT NULL,
    "total_output_token_received_post_fees" numeric NOT NULL,
    "frequency_in_seconds" numeric NOT NULL,
    "drip_max_jitter" int NOT NULL,
    "drip_activation_genesis_shift" int NOT NULL,
    "drip_activation_timestamp" timestamp with time zone NOT NULL,
    "cycle" numeric NOT NULL
);

CREATE TABLE "token_account" (
    "public_key" varchar(44) PRIMARY KEY,
    "mint" varchar(44) NOT NULL,
    "owner" varchar(44) NOT NULL,
    "amount" numeric NOT NULL,
    "delegate" varchar(44),
    "delegate_amount" numeric NOT NULL,
    "is_initialized" boolean NOT NULL,
    "is_frozen" boolean NOT NULL,
    "is_native" boolean NOT NULL,
    "rent_exempt_reserve" numeric,
    "close_authority" varchar(44),
);

-- migrate:down
DROP TABLE "global_config";
DROP TABLE "global_config_signer";
DROP TABLE "pair_config";
DROP TABLE "drip_position_signer";
DROP TABLE "drip_position_nft_mapping";
DROP TABLE "drip_position";
DROP TYPE "owner_kind";