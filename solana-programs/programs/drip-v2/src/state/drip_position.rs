use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::errors::DripError;

#[account]
#[derive(Default, InitSpace)]
pub struct DripPosition {
    pub global_config: Pubkey,
    pub owner: DripPositionOwner,
    pub drip_fee_bps: u64,
    pub drip_position_signer: Pubkey,
    pub auto_credit_enabled: bool,
    pub input_token_mint: Pubkey,
    pub output_token_mint: Pubkey,
    pub input_token_account: Pubkey,
    pub output_token_account: Pubkey,
    pub drip_amount: u64,
    pub drip_amount_filled: u64,
    pub frequency_in_seconds: u64,
    pub total_input_token_dripped: u64,
    pub total_output_token_received: u64,
    // We store this separately and not inside the owner enum
    // because we want to preserve it between tokenizations
    pub drip_position_nft_mint: Option<Pubkey>,
    pub drip_max_jitter: u32, // only used to validate pre-jitter, post-jitter is infinite
    pub drip_activation_genesis_shift: i64,
    pub drip_activation_timestamp: i64,
    // TODO: Separate ephemeral state to its own ephemeral account
    pub ephemeral_drip_state: Option<EphemeralDripState>,
}

impl DripPosition {
    pub fn is_activated(&self) -> Result<bool> {
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        Ok(current_timestamp >= (self.drip_activation_timestamp - (self.drip_max_jitter as i64)))
    }

    //                      Canonical Drip Activation Timestamp
    //                                     |
    //                        -----------------------------
    //                      /             \                 \
    //                     |               |                 |
    //  Genesis            V               V                 V
    //  0    cycle 0       1    cycle 1    2     cycle 2     3      ...
    // -|------------------|---------------|-----------------|---------------->
    //                     <-----freq------>
    //
    // A cycle may or may not have a drip (comprised of one or more partial drips),
    // but the position will always traverse cycles with pre-defined boundaries.
    //
    // A consequence of this is that our dripper could drip at the end of cycle X and at the beginning of cycle X + 1 (this is okay).
    //
    // To prevent ALL positions with the same freq & pair from destroying each other's price execution,
    // we also use a genesis shift which is a permanent shift from the canonical cycle boundaries based on the
    // genesis timestamp of the position.
    //
    //                      Canonical Drip Activation Timestamp
    //                                     |
    //  Genesis Shift         -----------------------------
    //     /                /             \                 \
    //    |                |               |                 |
    //    V                |               |                 |
    //  <---->             V               V                 V
    //  0    cycle 0       1    cycle 1    2     cycle 2     3      ...
    // -|----|-------------|----|----------|----|------------|---------------->
    //       |             <----|freq------>    |
    //       |                  |               |
    //       V                  V               V
    //    Genesis           Shifted 1        Shifted 2
    //
    // As seen above, we have canonical cycles and shifted cycles.
    // Positions traverse the shifted cycles to mitigate the poor price execution.
    // Of course this doesn't protect against >1 users opening positions
    // with the same freq & pair AT THE SAME TIME, but this is MUCH lower probability.
    //
    // NOTE: Canonical cycle boundaries are integer multiples of drip_frequency, shifted cycle boundaries are not.

    pub fn init_drip_timestamps(&mut self) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let drip_frequency = self.frequency_in_seconds as i64;

        let genesis_canonical_activation_timestamp = now - (now % drip_frequency);
        self.drip_activation_genesis_shift = now - genesis_canonical_activation_timestamp;

        self.drip_activation_timestamp = now;

        Ok(())
    }

    pub fn advance_drip_activation_timestamp(&mut self) -> Result<()> {
        let drip_frequency = self.frequency_in_seconds as i64;

        // If pre-jitter, clip it to current activation
        let now = i64::max(Clock::get()?.unix_timestamp, self.drip_activation_timestamp);
        let unshifted_now = now - self.drip_activation_genesis_shift;

        let current_canonical_activation_timestamp =
            unshifted_now - (unshifted_now % drip_frequency);

        let shifted_current_canonical_activation_timestamp =
            current_canonical_activation_timestamp + self.drip_activation_genesis_shift;

        self.drip_activation_timestamp =
            shifted_current_canonical_activation_timestamp + drip_frequency;

        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, InitSpace, Clone)]
pub struct EphemeralDripState {
    pub output_token_account_balance_pre_drip_snapshot: u64,
    pub current_pre_fees_partial_drip_amount: u64,
    pub minimum_output_expected: u64,
}

impl DripPosition {
    pub fn is_tokenized(&self) -> bool {
        matches!(self.owner, DripPositionOwner::Tokenized)
    }

    pub fn is_directly_owned_by(&self, signer: Pubkey) -> bool {
        match self.owner {
            DripPositionOwner::Direct { owner } => signer.eq(&owner),
            _ => false,
        }
    }

    pub fn has_associated_nft_mint(&self, nft_mint: &Pubkey) -> bool {
        match self.drip_position_nft_mint {
            Some(key) => key.eq(nft_mint),
            _ => false,
        }
    }

    pub fn is_owned_by_signer<'info>(
        &self,
        signer: &Signer<'info>,
        drip_position_nft_mint: &Option<Account<'info, Mint>>,
        drip_position_nft_account: &Option<Account<'info, TokenAccount>>,
    ) -> Result<bool> {
        match self.owner {
            DripPositionOwner::Tokenized => {
                match (
                    self.drip_position_nft_mint,
                    drip_position_nft_mint,
                    drip_position_nft_account,
                ) {
                    (Some(expected_nft_mint), Some(actual_nft_mint), Some(nft_account)) => {
                        Ok(expected_nft_mint.eq(&actual_nft_mint.key())
                            && actual_nft_mint.key().eq(&nft_account.mint)
                            && signer.key().eq(&nft_account.owner)
                            && nft_account.amount.eq(&1))
                    }
                    _ => err!(DripError::InsufficientInfoForTokenizedOwnerCheck),
                }
            }
            DripPositionOwner::Direct { owner } => Ok(owner.eq(signer.key)),
        }
    }
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, InitSpace)]
pub enum DripPositionOwner {
    Direct { owner: Pubkey },
    Tokenized,
}

impl Default for DripPositionOwner {
    fn default() -> Self {
        Self::Direct {
            owner: Pubkey::default(),
        }
    }
}

#[account]
#[derive(Default, InitSpace)]
pub struct DripPositionSigner {
    pub version: u8,
    pub drip_position: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(Default, InitSpace)]
// The goal of this account is to be able to get from the tokenized position NFT pubkey to the position pubkey by walking through an intermediary PDA
pub struct DripPositionNftMapping {
    pub version: u8,
    pub drip_position_nft_mint: Pubkey,
    pub drip_position: Pubkey,
    pub bump: u8,
}
