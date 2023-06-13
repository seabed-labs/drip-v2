-- TODO: can technically combine these two tables, but these are temporary until we have a queue anyways
CREATE TABLE "tx_queue_items" (
    "tx_signature" varchar(255) NOT NULL,
    "priority" int NOT NULL DEFAULT 3,
    "attempts" int NOT NULL DEFAULT 0,
    "max_attempts" int NOT NULL DEFAULT 10,
    "time" timestamp NOT NULL DEFAULT NOW(),
    "retry_time" timestamp,
    PRIMARY KEY(tx_signature)
);

CREATE TABLE "account_queue_items" (
    "public_key" varchar(255) NOT NULL,
    "priority" int NOT NULL DEFAULT 3,
    "attempts" int NOT NULL DEFAULT 0,
    "max_attempts" int NOT NULL DEFAULT 10,
    "time" timestamp NOT NULL DEFAULT NOW(),
    "retry_time" timestamp,
    PRIMARY KEY(public_key)
);
