-- migrate:up
CREATE TABLE "GlobalConfig" (
  "publicKey" varchar(44) PRIMARY KEY,
  "version" int NOT NULL,
  "superAdmin" varchar(44) NOT NULL,
  "admins" varchar(44)[] NOT NULL,
  "adminPermissions" numeric[] NOT NULL,
  "defaultDripFeeBps" int NOT NULL,
  "globalConfigSigner" varchar(44) NOT NULL
);

CREATE TABLE "GlobalConfigSigner" (
    "publicKey" varchar(44) PRIMARY KEY,
    "version" int NOT NULL,
    "globalConfig" varchar(44) NOT NULL,
    "bump" int NOT NULL
);

CREATE TYPE oraclekind as ENUM ('Unavailable', 'Pyth');

CREATE TABLE "PairConfig" (
    "publicKey" varchar(44) PRIMARY KEY,
    "version" int NOT NULL,
    "globalConfig" varchar(44) NOT NULL,
    "inputTokenMint" varchar(44) NOT NULL,
    "outputTokenMint" varchar(44) NOT NULL,
    "bump" int NOT NULL,
    "defaultPairDripFeeBps" int NOT NULL,
    "inputTokenDripFeePortionBps" int NOT NULL,
    "inputTokenPriceOracleKind" oraclekind NOT NULL,
    "inputTokenPriceOracleValue" varchar(44),
    "outputTokenPriceOracleKind" oraclekind NOT NULL,
    "outputTokenPriceOracleValue" varchar(44)
);

CREATE TABLE "DripPositionSigner" (
    "publicKey" varchar(44) PRIMARY KEY,
    "dripPosition" varchar(44) NOT NULL,
    "version" int NOT NULL,
    "bump" int NOT NULL
);


CREATE TABLE "DripPosition" (
    "publicKey" varchar(44) PRIMARY KEY,
    "globalConfig" varchar(44) NOT NULL,
    "pairConfig" varchar(44) NOT NULL,
    "inputTokenAccount" varchar(44) NOT NULL,
    "outputTokenAccount" varchar(44) NOT NULL,
    "owner" varchar(44) NOT NULL,
    "dripAmountPreFees" numeric NOT NULL,
    "maxSlippageBps" int NOT NULL,
    "maxPriceDeviationBps" int NOT NULL,
    "dripFeeBps" int NOT NULL,
    "dripAmountRemainingPostFeesInCurrentCycle" numeric NOT NULL,
    "dripInputFeesRemainingForCurrentCycle" numeric NOT NULL,
    "totalInputFeesCollected" numeric NOT NULL,
    "totalOutputFeesCollected" numeric NOT NULL,
    "totalInputTokenDrippedPostFees" numeric NOT NULL,
    "totalOutputTokenReceivedPostFees" numeric NOT NULL,
    "frequencyInSeconds" numeric NOT NULL,
    "dripMaxJitter" int NOT NULL,
    "dripActivationGenesisShift" int NOT NULL,
    "dripActivationTimestamp" timestamp with time zone NOT NULL,
    "cycle" numeric NOT NULL
);

CREATE TABLE "TokenAccount" (
    "publicKey" varchar(44) PRIMARY KEY,
    "mint" varchar(44) NOT NULL,
    "owner" varchar(44) NOT NULL,
    "amount" numeric NOT NULL,
    "delegate" varchar(44),
    "delegateAmount" numeric NOT NULL,
    "isInitialized" boolean NOT NULL,
    "isFrozen" boolean NOT NULL,
    "isNative" boolean NOT NULL,
    "rentExemptReserve" numeric,
    "closeAuthority" varchar(44)
);

CREATE TABLE "DripPositionWalletOwner" (
    "dripPositionPublicKey" varchar(44) PRIMARY KEY,
    "walletPublicKey" varchar(44)
)

-- migrate:down
DROP TABLE "GlobalConfig" CASCADE;
DROP TABLE "GlobalConfigSigner" CASCADE;
DROP TABLE "PairConfig" CASCADE;
DROP TABLE "DripPositionSigner" CASCADE;
DROP TABLE "DripPosition" CASCADE;
DROP TABLE "TokenAccount" CASCADE;
DROP TABLE "DripPositionWalletOwner" CASCADE;
DROP TYPE "oraclekind" CASCADE;