use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct FeeCollector {
    pub version: u8,
    pub global_config: Pubkey,
    pub bump: u8,
}
