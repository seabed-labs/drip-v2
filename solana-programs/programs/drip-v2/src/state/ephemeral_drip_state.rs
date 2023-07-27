use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EphemeralDripState {
    pub version: u8,           // 1
    pub bump: u8,              // 1
    pub drip_position: Pubkey, // 32
    // EphemeralDripState.dripper_input_token_account_balance_pre_drip_balance
    // is the dripper input TA balance before any calculations/state changes.
    // size: 8
    pub dripper_input_token_account_balance_pre_drip_balance: u64,
    // EphemeralDripState.dripper_output_token_account_balance_pre_drip_balance
    // is the dripper output TA balance before any calculations/state changes.
    // size: 8
    pub dripper_output_token_account_balance_pre_drip_balance: u64,
    // EphemeralDripState.drip_position_input_token_account_balance_pre_drip_balance
    // is the position input TA balance before any calculations/state changes.
    // size: 8
    pub drip_position_input_token_account_balance_pre_drip_balance: u64,
    // EphemeralDripState.drip_position_output_token_account_balance_pre_drip_balance
    // is the position output TA balance before any calculations/state changes.
    // size: 8
    pub drip_position_output_token_account_balance_pre_drip_balance: u64,
    // EphemeralDripState.input_transferred_to_dripper is the amount that has been transferred to the
    // dripper input TA.
    // size: 8
    pub input_transferred_to_dripper: u64,
    // EphemeralDripState.minimum_output_expected is the minimum output tokens expected.
    // This is used to protect against large slippage.
    // size: 8
    pub minimum_output_expected: u64,
    // EphemeralDripState.input_reserved_for_fees is the maximum amount of input tokens
    // reserved for fees. These fees are transferred in post_drip.
    // size: 8
    // pub input_reserved_for_fees: u64,
    // EphemeralDripState.input_reserved_for_fees is the bps to apply to the input tokens
    // size: 8
    pub input_drip_fees_bps: u64,
    // EphemeralDripState.input_reserved_for_fees is the bps to apply to the output tokens
    // size: 8
    pub output_drip_fees_bps: u64,
}
