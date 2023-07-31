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
-- Name: owner_kind; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.owner_kind AS ENUM (
    'Direct',
    'Tokenized'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: drip_position; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drip_position (
    public_key character varying(44) NOT NULL,
    global_config character varying(44) NOT NULL,
    pair_config character varying(44) NOT NULL,
    input_token_account character varying(44) NOT NULL,
    output_token_account character varying(33) NOT NULL,
    owner_value character varying(44),
    owner_kind public.owner_kind NOT NULL,
    drip_amount_pre_fees numeric NOT NULL,
    max_slippage_bps integer NOT NULL,
    max_price_deviation_bps integer NOT NULL,
    drip_fee_bps integer NOT NULL,
    drip_position_nft_mint character varying(44),
    auto_credit_enabled boolean NOT NULL,
    drip_amount_remaining_post_fees_in_current_cycle numeric NOT NULL,
    drip_input_fees_remaining_for_current_cycle numeric NOT NULL,
    total_input_fees_collected numeric NOT NULL,
    total_output_fees_collected numeric NOT NULL,
    "total_input_token_DrippedPostFees" numeric NOT NULL,
    total_output_token_received_post_fees numeric NOT NULL,
    frequency_in_seconds numeric NOT NULL,
    drip_max_jitter integer NOT NULL,
    drip_activation_genesis_shift integer NOT NULL,
    drip_activation_timestamp timestamp with time zone NOT NULL,
    cycle numeric NOT NULL
);


--
-- Name: drip_position_nft_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drip_position_nft_mapping (
    public_key character varying(44) NOT NULL,
    drip_position_nft_mint character varying(44) NOT NULL,
    drip_position character varying(44) NOT NULL,
    bump integer NOT NULL
);


--
-- Name: drip_position_signer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drip_position_signer (
    public_key character varying(44) NOT NULL,
    drip_position character varying(44) NOT NULL,
    version integer NOT NULL,
    bump integer NOT NULL
);


--
-- Name: drip_position_wallet_owner; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drip_position_wallet_owner (
    drip_position_public_key character varying(44) NOT NULL,
    wallet_public_key character varying(44)
);


--
-- Name: global_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_config (
    public_key character varying(44) NOT NULL,
    version integer NOT NULL,
    super_admin character varying(44) NOT NULL,
    admins character varying(44)[] NOT NULL,
    admin_permissions numeric[] NOT NULL,
    default_drip_fee_bps integer NOT NULL,
    global_config_signer character varying(44) NOT NULL
);


--
-- Name: global_config_signer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.global_config_signer (
    public_key character varying(44) NOT NULL,
    version integer NOT NULL,
    global_config character varying(44) NOT NULL,
    bump integer NOT NULL
);


--
-- Name: pair_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pair_config (
    public_key character varying(44) NOT NULL,
    global_config character varying(44) NOT NULL,
    input_token_mint character varying(44) NOT NULL,
    output_token_mint character varying(44) NOT NULL,
    bump integer NOT NULL,
    default_drip_fee_bps integer NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schema_migrations (
    version character varying(128) NOT NULL
);


--
-- Name: token_account; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.token_account (
    public_key character varying(44) NOT NULL,
    mint character varying(44) NOT NULL,
    owner character varying(44) NOT NULL,
    amount numeric NOT NULL,
    delegate character varying(44),
    delegate_amount numeric NOT NULL,
    is_initialized boolean NOT NULL,
    is_frozen boolean NOT NULL,
    is_native boolean NOT NULL,
    rent_exempt_reserve numeric,
    close_authority character varying(44)
);


--
-- Name: drip_position_nft_mapping drip_position_nft_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_position_nft_mapping
    ADD CONSTRAINT drip_position_nft_mapping_pkey PRIMARY KEY (public_key);


--
-- Name: drip_position drip_position_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_position
    ADD CONSTRAINT drip_position_pkey PRIMARY KEY (public_key);


--
-- Name: drip_position_signer drip_position_signer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_position_signer
    ADD CONSTRAINT drip_position_signer_pkey PRIMARY KEY (public_key);


--
-- Name: drip_position_wallet_owner drip_position_wallet_owner_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drip_position_wallet_owner
    ADD CONSTRAINT drip_position_wallet_owner_pkey PRIMARY KEY (drip_position_public_key);


--
-- Name: global_config global_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_config
    ADD CONSTRAINT global_config_pkey PRIMARY KEY (public_key);


--
-- Name: global_config_signer global_config_signer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.global_config_signer
    ADD CONSTRAINT global_config_signer_pkey PRIMARY KEY (public_key);


--
-- Name: pair_config pair_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pair_config
    ADD CONSTRAINT pair_config_pkey PRIMARY KEY (public_key);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: token_account token_account_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.token_account
    ADD CONSTRAINT token_account_pkey PRIMARY KEY (public_key);


--
-- PostgreSQL database dump complete
--


--
-- Dbmate schema migrations
--

INSERT INTO public.schema_migrations (version) VALUES
    ('20230729223841');
