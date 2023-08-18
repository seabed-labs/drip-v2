use anchor_lang::prelude::*;

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
    // The authority/owner of this position.
    // Funds will be withdraw to the ata of this address
    // This address must sign to perform a close/deposit instruction
    // size: 32
    pub owner: Pubkey,
    // The the user defined drip_amount.
    // Input fees are deducted from this amount before every drip as defined by
    // DripPosition.drip_fee_bps and PairConfig.input_token_drip_fee_portion_bps
    // This field is supplied by the user in init_drip_position.
    // size: 8
    pub drip_amount_pre_fees: u64,
    // The maximum slippage allowed every drip.
    // This field is supplied by the user in init_drip_position.
    pub max_slippage_bps: u16,
    // The maximum deviation from oracle price allowed.
    // This field is supplied by the user in init_drip_position.
    pub max_price_deviation_bps: u16,
    // The total fee bps that will be deduced from this position.
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
    // This is the flag for enabling the auto credit feature.
    // If this is enabled, the output tokens from each drip are transferred to the owner in the drip tx.
    // This can ONLY be enabled if the owner is of type Direct.
    // Valid Cases:
    // auto credit enabled, direct ownership
    // auto credit disabled, direct ownership
    // auto credit disabled, tokenized ownership
    // size: 1
    pub auto_credit_enabled: bool,
    // Represents the maximum amount of input tokens
    // the dripper can request to withdraw in pre_drip.
    // This value is initialized to be drip_amount - reserved_input_fees in init_drip_position.
    // This value is reset in the last partial drip of a cycle.
    // size: 8
    pub drip_amount_remaining_post_fees_in_current_cycle: u64,
    // Represents how much of the input tokens the protocol
    // can transfer from this position this cycle.
    // This field is initialized in init_drip_position.
    // This field is reduced in post_drip.
    // This field is reset in the last post_drip of each cycle.
    // size: 8
    pub drip_input_fees_remaining_for_current_cycle: u64,
    // Represents the lifetime total amount of input tokens transferred for protocol fees for this position.
    // This field is updated in pre_drip.
    // size: 8
    pub total_input_fees_collected: u64,
    // Represents the lifetime total amount of output tokens transferred for protocol fees for this position.
    // This field is updated in post_drip.
    // size: 8
    pub total_output_fees_collected: u64,
    // Represents the total amount of input tokens swapped.
    // This field is updated in post_drip.
    // size: 8
    pub total_input_token_dripped_post_fees: u64,
    // Represents the total amount of input tokens swapped.
    // This field is updated in post_drip.
    // size: 8
    pub total_output_token_received_post_fees: u64,
    // frequency_in_seconds - drip_max_jitter is the minimum amount of time between two full drips.
    // size: 8
    pub frequency_in_seconds: u64,
    // Represents the max deviation that can be applied to when a drip will execute.
    // A random value from -DripPosition.drip_max_jitter to infinity will be added to drip_activation_timestamp
    // off chain to determine the the drip time.
    // During pre_drip, only pre-jitter can be validated, infinite post-jitter is permissible.
    // size: 4
    pub drip_max_jitter: u32,
    // size: 8
    pub drip_activation_genesis_shift: i64,
    // Represents the earliest time (solana time) when this position can drip.
    // After a full drip is complete, this field is updated to a future time
    // based on drip_activation_genesis_shift and frequency_in_seconds.
    // This field is updated in post_drip.
    // size: 8
    pub drip_activation_timestamp: i64,
    // DripPosition.cycle represents what cycle the position is in.
    // Cycle starts at 0 when initialized, and is incremented in post_drip when a drip is completed.
    // A full drip occurs when drip_amount_remaining_post_fees_in_current_cycle == 0.
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

#[account]
#[derive(Default, InitSpace)]
pub struct DripPositionSigner {
    pub version: u8,
    pub drip_position: Pubkey,
    pub bump: u8,
}
