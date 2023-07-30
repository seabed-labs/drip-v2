use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::errors::DripError;

#[account]
#[derive(Default, InitSpace)]
pub struct DripPosition {
    // size: 32
    pub global_config: Pubkey,
    // size: 32
    pub pair_config: Pubkey,
    // size: 32
    pub input_token_account: Pubkey,
    // size: 32
    pub output_token_account: Pubkey,
    // DripPosition.owner is the authority/owner of this position.
    // If this is a directly owned position, it contains a wallet address.
    // If this is a tokenized position, the owner is any wallet that has a balance of 1 for the DripPosition.drip_position_nft_mint
    // size: 32
    pub owner: DripPositionOwner,
    // DripPosition.drip_fee_bps is the total fee bps that will be deduced from this position.
    // This value is split between input token pre swap and output token post swap based on the PairConfig.input_token_drip_fee_portion_bps
    // This value has a default value of PairConfig.default_pair_drip_fee_bps.
    // An admin with sufficient permissions can change the position fees via the (TODO) instruction.
    // size: 8
    pub drip_fee_bps: u16,
    // For positions that are tokenized, this mint represents a proxy to the owner.
    // Users who have a balance for this mint and have a tokenized position is a valid "owner" for this position.
    // We store this separately and not inside the owner enum
    // because we want to preserve it between tokenizations
    // size: 1 + 32
    pub drip_position_nft_mint: Option<Pubkey>,
    // DripPosition.auto_credit_enabled is a flag for enabling the auto credit feature.
    // If this is enabled, the output tokens from each drip are transferred to the owner in the drip tx.
    // This can ONLY be enabled if the owner is of type Direct.
    // Valid Cases:
    // auto credit enabled, direct ownership
    // auto credit disabled, direct ownership
    // auto credit disabled, tokenized ownership
    // size: 1
    pub auto_credit_enabled: bool,
    // DripPosition.drip_amount_pre_fees is the user defined drip_amount.
    // Input fees are deducted from this amount before every drip as defined by
    // DripPosition.drip_fee_bps and PairConfig.input_token_drip_fee_portion_bps
    // size: 8
    pub drip_amount_pre_fees: u64,
    // DripPosition.drip_amount_remaining_post_fees_in_current_cycle represents the maximum amount of input tokens
    // the dripper can request to withdraw in pre_drip.
    // This value is initialized to be drip_amount - reserved_input_fees in init_drip_position.
    // This value is reset in the last partial drip of a cycle.
    // size: 8
    pub drip_amount_remaining_post_fees_in_current_cycle: u64,
    // DripPosition.drip_input_fees_remaining_for_current_cycle represents how much of the input tokens the protocol
    // can transfer from this position this cycle.
    // This field is initialized in init_drip_position.
    // This field is reduced in post_drip.
    // This field is reset in the last post_drip of each cycle.
    // size: 8
    pub drip_input_fees_remaining_for_current_cycle: u64,
    // DripPosition.total_input_fees_collected represents the lifetime total amount of input tokens transferred for protocol fees for this position.
    // This field is updated in pre_drip.
    // size: 8
    pub total_input_fees_collected: u64,
    // DripPosition.total_output_fees_collected represents the lifetime total amount of output tokens transferred for protocol fees for this position.
    // This field is updated in post_drip.
    // size: 8
    pub total_output_fees_collected: u64,
    // DripPosition.total_input_token_dripped represents the total amount of input tokens swapped.
    // This field is updated in post_drip.
    // size: 8
    pub total_input_token_dripped_post_fees: u64,
    // DripPosition.total_output_token_received represents the total amount of input tokens swapped.
    // This field is updated in post_drip.
    // size: 8
    pub total_output_token_received_post_fees: u64,
    // DripPosition.frequency_in_seconds - DripPosition.drip_max_jitter is the minimum amount of time between two full drips.
    // A full drip occurs when DripPosition.drip_amount_filled == DripPosition.drip_amount
    // size: 8
    pub frequency_in_seconds: u64,
    // DripPosition.drip_max_jitter is a the max deviation that can be applied to when a drip will execute.
    // A random value from -DripPosition.drip_max_jitter to infinity will be added to drip_activation_timestamp
    // off chain to determine the the drip time.
    // During pre_drip, only pre-jitter can be validated, infinite post-jitter is permissible.
    // size: 4
    pub drip_max_jitter: u32,
    // size: 8
    pub drip_activation_genesis_shift: i64,
    // DripPosition.drip_activation_timestamp represents the earliest time (solana time) when
    // this position can drip. After a full drip is complete, this field is updated to a future time
    // based on DripPosition.drip_activation_genesis_shift and DripPosition.frequency_in_seconds
    // This field is updated in post_drip.
    // size: 8
    pub drip_activation_timestamp: i64,
    // DripPosition.cycle represents what cycle the position is in.
    // Cycle starts at 0 when initialized, and is incremented in post_drip when a drip is completed.
    pub cycle: u64,
}

pub struct InitDripTime {
    pub drip_activation_genesis_shift: i64,
    pub drip_activation_timestamp: i64,
    pub cycle: u64,
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

    pub fn get_init_drip_timestamp(&self) -> Result<InitDripTime> {
        let now = Clock::get()?.unix_timestamp;
        let drip_frequency = self.frequency_in_seconds as i64;

        let genesis_canonical_activation_timestamp = now - (now % drip_frequency);
        let drip_activation_genesis_shift = now - genesis_canonical_activation_timestamp;

        let drip_activation_timestamp = now;
        Ok(InitDripTime {
            drip_activation_genesis_shift,
            drip_activation_timestamp,
            cycle: 0,
        })
    }

    pub fn get_next_drip_activation_timestamp(&self) -> Result<i64> {
        let drip_frequency = self.frequency_in_seconds as i64;

        // If pre-jitter, clip it to current activation
        let now = i64::max(Clock::get()?.unix_timestamp, self.drip_activation_timestamp);
        let unshifted_now = now - self.drip_activation_genesis_shift;

        let current_canonical_activation_timestamp =
            unshifted_now - (unshifted_now % drip_frequency);

        let shifted_current_canonical_activation_timestamp =
            current_canonical_activation_timestamp + self.drip_activation_genesis_shift;
        Ok(shifted_current_canonical_activation_timestamp)
    }
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
