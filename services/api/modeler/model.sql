CREATE SCHEMA IF NOT EXISTS dcaf;

CREATE TABLE dcaf."account_queue" (
  "id" bigserial NOT NULL,
  "public_key" text NOT NULL,
  "priority" bigint NOT NULL DEFAULT 3,
  "attempts" bigint NOT NULL DEFAULT 0,
  "max_attempts" bigint NOT NULL DEFAULT 10,
  "time" timestamp NOT NULL DEFAULT NOW(),
  "retry_time" timestamp,
  CONSTRAINT account_queue_pk PRIMARY KEY ("id"),
  CONSTRAINT unique_account_queue_public_key UNIQUE ("public_key")
);

CREATE TABLE dcaf."tx_queue" (
  "id" bigserial NOT NULL,
  "signature" text NOT NULL,
  "priority" bigint NOT NULL DEFAULT 3,
  "attempts" bigint NOT NULL DEFAULT 0,
  "max_attempts" bigint NOT NULL DEFAULT 10,
  "time" timestamp NOT NULL DEFAULT NOW(),
  "retry_time" timestamp,
  CONSTRAINT tx_queue_pk PRIMARY KEY ("id"),
  CONSTRAINT unique_tx_queue_signature UNIQUE ("signature")
);
