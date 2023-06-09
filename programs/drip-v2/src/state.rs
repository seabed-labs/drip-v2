use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct GlobalConfig {
    pub version: u64,                 // 8
    pub super_admin: Pubkey,          // 32
    pub admins: [Pubkey; 20],         // 32*20
    pub admin_permissions: [u64; 20], // 8*20
    pub default_drip_fee_bps: u64,    // 8
}

pub const GLOBAL_CONFIG_SPACE: usize = 8 + 8 + 32 + 32 * 20 + 8 * 20 + 8;
