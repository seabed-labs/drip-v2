use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct FeeCollector {
    pub global_config: Pubkey,
}
