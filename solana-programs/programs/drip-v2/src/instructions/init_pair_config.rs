use crate::state::{GlobalConfig, PairConfig, MAX_DRIP_FEE_PORTION_BPS};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct InitPairConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,
    pub input_token_mint: Box<Account<'info, Mint>>,
    pub output_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [
            b"drip-v2-pair-config",
            global_config.key().as_ref(),
            input_token_mint.key().as_ref(),
            output_token_mint.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + PairConfig::INIT_SPACE
    )]
    pub pair_config: Box<Account<'info, PairConfig>>,

    pub system_program: Program<'info, System>,
}

pub fn handle_init_pair_config(ctx: Context<InitPairConfig>) -> Result<()> {
    ctx.accounts.pair_config.global_config = ctx.accounts.global_config.key();
    ctx.accounts.pair_config.input_token_mint = ctx.accounts.input_token_mint.key();
    ctx.accounts.pair_config.output_token_mint = ctx.accounts.output_token_mint.key();
    ctx.accounts.pair_config.default_pair_drip_fee_bps =
        ctx.accounts.global_config.default_drip_fee_bps;
    // TODO: by default let's split 50/50?
    ctx.accounts.pair_config.input_token_drip_fee_portion_bps = MAX_DRIP_FEE_PORTION_BPS;
    ctx.accounts.pair_config.bump = *ctx.bumps.get("pair_config").unwrap();

    Ok(())
}
