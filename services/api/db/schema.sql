SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: oraclekind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.oraclekind AS ENUM (
    'Unavailable',
    'Pyth'
);


--
-- Name: ownerkind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.ownerkind AS ENUM (
    'Direct',
    'Tokenized'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: DripPosition; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DripPosition" (
    "publicKey" character varying(44) NOT NULL,
    "globalConfig" character varying(44) NOT NULL,
    "pairConfig" character varying(44) NOT NULL,
    "inputTokenAccount" character varying(44) NOT NULL,
    "outputTokenAccount" character varying(44) NOT NULL,
    "ownerValue" character varying(44),
    "ownerKind" public.ownerkind NOT NULL,
    "dripAmountPreFees" numeric NOT NULL,
    "maxSlippageBps" integer NOT NULL,
    "maxPriceDeviationBps" integer NOT NULL,
    "dripFeeBps" integer NOT NULL,
    "dripPositionNftMint" character varying(44),
    "autoCreditEnabled" boolean NOT NULL,
    "dripAmountRemainingPostFeesInCurrentCycle" numeric NOT NULL,
    "dripInputFeesRemainingForCurrentCycle" numeric NOT NULL,
    "totalInputFeesCollected" numeric NOT NULL,
    "totalOutputFeesCollected" numeric NOT NULL,
    "totalInputTokenDrippedPostFees" numeric NOT NULL,
    "totalOutputTokenReceivedPostFees" numeric NOT NULL,
    "frequencyInSeconds" numeric NOT NULL,
    "dripMaxJitter" integer NOT NULL,
    "dripActivationGenesisShift" integer NOT NULL,
    "dripActivationTimestamp" timestamp with time zone NOT NULL,
    cycle numeric NOT NULL
);


--
-- Name: DripPositionNftMapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DripPositionNftMapping" (
    "publicKey" character varying(44) NOT NULL,
    "dripPositionNftMint" character varying(44) NOT NULL,
    "dripPosition" character varying(44) NOT NULL,
    bump integer NOT NULL
);


--
-- Name: DripPositionSigner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DripPositionSigner" (
    "publicKey" character varying(44) NOT NULL,
    "dripPosition" character varying(44) NOT NULL,
    version integer NOT NULL,
    bump integer NOT NULL
);


--
-- Name: DripPositionWalletOwner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DripPositionWalletOwner" (
    "dripPositionPublicKey" character varying(44) NOT NULL,
    "walletPublicKey" character varying(44)
);


--
-- Name: GlobalConfig; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GlobalConfig" (
    "publicKey" character varying(44) NOT NULL,
    version integer NOT NULL,
    "superAdmin" character varying(44) NOT NULL,
    admins character varying(44)[] NOT NULL,
    "adminPermissions" numeric[] NOT NULL,
    "defaultDripFeeBps" integer NOT NULL,
    "globalConfigSigner" character varying(44) NOT NULL
);


--
-- Name: GlobalConfigSigner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."GlobalConfigSigner" (
    "publicKey" character varying(44) NOT NULL,
    version integer NOT NULL,
    "globalConfig" character varying(44) NOT NULL,
    bump integer NOT NULL
);


--
-- Name: PairConfig; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PairConfig" (
    "publicKey" character varying(44) NOT NULL,
    version integer NOT NULL,
    "globalConfig" character varying(44) NOT NULL,
    "inputTokenMint" character varying(44) NOT NULL,
    "outputTokenMint" character varying(44) NOT NULL,
    bump integer NOT NULL,
    "defaultPairDripFeeBps" integer NOT NULL,
    "inputTokenDripFeePortionBps" integer NOT NULL,
    "inputTokenPriceOracleKind" public.oraclekind NOT NULL,
    "inputTokenPriceOracleValue" character varying(44),
    "outputTokenPriceOracleKind" public.oraclekind NOT NULL,
    "outputTokenPriceOracleValue" character varying(44)
);


--
-- Name: TokenAccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TokenAccount" (
    "publicKey" character varying(44) NOT NULL,
    mint character varying(44) NOT NULL,
    owner character varying(44) NOT NULL,
    amount numeric NOT NULL,
    delegate character varying(44),
    "delegateAmount" numeric NOT NULL,
    "isInitialized" boolean NOT NULL,
    "isFrozen" boolean NOT NULL,
    "isNative" boolean NOT NULL,
    "rentExemptReserve" numeric,
    "closeAuthority" character varying(44)
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: DripPositionNftMapping DripPositionNftMapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DripPositionNftMapping"
    ADD CONSTRAINT "DripPositionNftMapping_pkey" PRIMARY KEY ("publicKey");


--
-- Name: DripPositionSigner DripPositionSigner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DripPositionSigner"
    ADD CONSTRAINT "DripPositionSigner_pkey" PRIMARY KEY ("publicKey");


--
-- Name: DripPositionWalletOwner DripPositionWalletOwner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DripPositionWalletOwner"
    ADD CONSTRAINT "DripPositionWalletOwner_pkey" PRIMARY KEY ("dripPositionPublicKey");


--
-- Name: DripPosition DripPosition_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DripPosition"
    ADD CONSTRAINT "DripPosition_pkey" PRIMARY KEY ("publicKey");


--
-- Name: GlobalConfigSigner GlobalConfigSigner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GlobalConfigSigner"
    ADD CONSTRAINT "GlobalConfigSigner_pkey" PRIMARY KEY ("publicKey");


--
-- Name: GlobalConfig GlobalConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."GlobalConfig"
    ADD CONSTRAINT "GlobalConfig_pkey" PRIMARY KEY ("publicKey");


--
-- Name: PairConfig PairConfig_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PairConfig"
    ADD CONSTRAINT "PairConfig_pkey" PRIMARY KEY ("publicKey");


--
-- Name: TokenAccount TokenAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TokenAccount"
    ADD CONSTRAINT "TokenAccount_pkey" PRIMARY KEY ("publicKey");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20230729223841');
