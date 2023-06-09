pub mod state;

use anchor_lang::prelude::*;
use state::{GlobalConfig, GLOBAL_CONFIG_SPACE};

declare_id!("74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk");

#[program]
pub mod drip_v2 {
    use super::*;

    pub fn init_global_config(
        ctx: Context<InitGlobalConfig>,
        params: InitGlobalConfigParams,
    ) -> Result<()> {
        ctx.accounts.global_config.version = params.version;
        ctx.accounts.global_config.super_admin = params.super_admin;
        ctx.accounts.global_config.default_drip_fee_bps = params.default_drip_fee_bps;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitGlobalConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(init, payer = payer, space = GLOBAL_CONFIG_SPACE)]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitGlobalConfigParams {
    pub version: u64,
    pub super_admin: Pubkey,
    pub default_drip_fee_bps: u64,
}
