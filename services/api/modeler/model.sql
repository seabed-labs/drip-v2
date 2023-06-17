CREATE SCHEMA IF NOT EXISTS dcaf;

CREATE TABLE dcaf."account_queue" (
  "id" bigserial NOT NULL,
  "public_key" text NOT NULL,
  "priority" bigint NOT NULL DEFAULT 3,
  "attempts" bigint NOT NULL DEFAULT 0,
  "max_attempts" bigint NOT NULL DEFAULT 10,
  "time" timestamp NOT NULL DEFAULT NOW(),
  "retry_time" timestamp,
  CONSTRAINT account_queue_items_pk PRIMARY KEY (id),
  CONSTRAINT unique_public_key UNIQUE (public_key)
);

CREATE TABLE dcaf."tx_queue" (
  "id" bigserial NOT NULL,
  "tx_signature" text NOT NULL,
  "priority" bigint NOT NULL DEFAULT 3,
  "attempts" bigint NOT NULL DEFAULT 0,
  "max_attempts" bigint NOT NULL DEFAULT 10,
  "time" timestamp NOT NULL DEFAULT NOW(),
  "retry_time" timestamp,
  CONSTRAINT tx_queue_items_pk PRIMARY KEY (id),
  CONSTRAINT unique_tx_signature UNIQUE (tx_signature)
);

