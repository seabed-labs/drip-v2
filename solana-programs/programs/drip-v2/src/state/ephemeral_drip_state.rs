use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct EphemeralDripState {
    pub version: u8,                                         //1
    pub bump: u8,                                            //1
    pub drip_position: Pubkey,                               // 32
    pub output_token_account_balance_pre_drip_snapshot: u64, // 8
    pub minimum_output_expected: u64,                        // 8
    pub pre_fees_partial_drip_amount: u64,                   // 8
    pub dripped_input_tokens: u64,                           //8
}
