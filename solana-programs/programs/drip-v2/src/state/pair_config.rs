use anchor_lang::prelude::*;
use pyth_sdk_solana::state::load_price_account;
use std::ops::Deref;

use crate::errors::DripError;

const PYTH_ORACLE_PROGRAM_PUBKEY: &str = "FsJ3A3u2vn5cTVofAjvy6y5kwABJAqYWpe4975bi2epH";

#[derive(Clone)]
pub struct PriceFeed(pyth_sdk_solana::PriceFeed);

impl Owner for PriceFeed {
    fn owner() -> Pubkey {
        Pubkey::try_from(PYTH_ORACLE_PROGRAM_PUBKEY).unwrap()
    }
}

impl anchor_lang::AccountDeserialize for PriceFeed {
    fn try_deserialize_unchecked(data: &mut &[u8]) -> Result<Self> {
        let account = match load_price_account(data) {
            Ok(data) => data,
            Err(_) => {
                return err!(DripError::PythPriceFeedLoadError);
            }
        };

        // from example: https://github.com/pyth-network/pyth-sdk-rs/blob/main/examples/sol-anchor-contract/programs/sol-anchor-contract/src/state.rs#L26-L36
        // Use a dummy key since the key field will be removed from the SDK
        let zeros: [u8; 32] = [0; 32];
        let dummy_key = Pubkey::new_from_array(zeros);
        let feed = account.to_price_feed(&dummy_key);
        Ok(PriceFeed(feed))
    }
}

impl anchor_lang::AccountSerialize for PriceFeed {
    fn try_serialize<W: std::io::Write>(&self, _writer: &mut W) -> std::result::Result<(), Error> {
        err!(DripError::CannotSerializePriceFeedAccount)
    }
}

impl Deref for PriceFeed {
    type Target = pyth_sdk_solana::PriceFeed;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

pub const MAX_DRIP_FEE_PORTION_BPS: u64 = 10_000;

#[account]
#[derive(Default, InitSpace)]
pub struct PairConfig {
    pub version: u8,
    pub global_config: Pubkey,
    pub input_token_mint: Pubkey,
    pub output_token_mint: Pubkey,
    pub bump: u8,
    pub default_pair_drip_fee_bps: u64,
    pub input_token_drip_fee_portion_bps: u64, // max of 10000
    pub input_token_price_oracle: PriceOracle,
    pub output_token_price_oracle: PriceOracle,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, InitSpace, Default)]
pub enum PriceOracle {
    #[default]
    Unavailable,
    Pyth {
        pyth_price_feed_account: Pubkey,
    },
}
