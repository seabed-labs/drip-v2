use crate::state::{GlobalConfig, GlobalSigner};
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
            b"drip-v2-global-signer",
            global_config.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + GlobalSigner::INIT_SPACE
    )]
    pub global_signer: Account<'info, GlobalSigner>,

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
    ctx.accounts.global_config.global_signer = ctx.accounts.global_signer.key();

    ctx.accounts.global_signer.global_config = ctx.accounts.global_config.key();
    ctx.accounts.global_signer.bump = *ctx.bumps.get("global_signer").unwrap();

    Ok(())
}
