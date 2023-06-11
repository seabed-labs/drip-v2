use crate::state::{FeeCollector, GlobalConfig};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitGlobalConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(init, payer = payer, space = 8 + GlobalConfig::INIT_SPACE)]
    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        init,
        seeds = [
            b"drip-v2-fee-collector",
            global_config.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + FeeCollector::INIT_SPACE
    )]
    pub fee_collector: Account<'info, FeeCollector>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitGlobalConfigParams {
    pub super_admin: Pubkey,
    pub default_drip_fee_bps: u64,
}

pub fn handle_init_global_config(
    ctx: Context<InitGlobalConfig>,
    params: InitGlobalConfigParams,
) -> Result<()> {
    ctx.accounts.global_config.version = 0;
    ctx.accounts.global_config.super_admin = params.super_admin;
    ctx.accounts.global_config.default_drip_fee_bps = params.default_drip_fee_bps;
    ctx.accounts.global_config.fee_collector = ctx.accounts.fee_collector.key();

    ctx.accounts.fee_collector.global_config = ctx.accounts.global_config.key();
    ctx.accounts.fee_collector.bump = *ctx.bumps.get("fee_collector").unwrap();

    Ok(())
}
