use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EphemeralDripState {
    pub version: u8,                                                      // 1
    pub bump: u8,                                                         // 1
    pub drip_position: Pubkey,                                            // 32
    pub dripper_input_token_account_balance_pre_drip_balance: u64,        // 8
    pub dripper_output_token_account_balance_pre_drip_balance: u64,       // 8
    pub drip_position_input_token_account_balance_pre_drip_balance: u64,  // 8
    pub drip_position_output_token_account_balance_pre_drip_balance: u64, // 8
    pub input_transferred_to_fee_account: u64,                            // 8
    pub input_transferred_to_dripper: u64,                                // 8
    pub minimum_output_expected: u64,                                     // 8
    pub output_drip_fees_bps: u64,                                        //8
}
