use crate::{
    errors::DripError,
    state::{AdminPermission, GlobalConfig, PairConfig},
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct InitPairConfig<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,
    pub input_mint: Box<Account<'info, Mint>>,
    pub output_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        seeds = [
            b"drip-v2-pair-config",
            global_config.key().as_ref(),
            input_mint.key().as_ref(),
            output_mint.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + PairConfig::INIT_SPACE
    )]
    pub pair_config: Box<Account<'info, PairConfig>>,

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitPairConfigParams {
    pub pyth_price_feed: Option<Pubkey>,
}

pub fn handle_init_pair_config(
    ctx: Context<InitPairConfig>,
    params: InitPairConfigParams,
) -> Result<()> {
    require!(
        ctx.accounts
            .global_config
            .is_authorized(&ctx.accounts.signer, AdminPermission::InitPairConfig),
        DripError::OperationUnauthorized
    );

    ctx.accounts.pair_config.input_mint = ctx.accounts.input_mint.key();
    ctx.accounts.pair_config.output_mint = ctx.accounts.output_mint.key();
    ctx.accounts.pair_config.pyth_price_feed = params.pyth_price_feed;
    ctx.accounts.pair_config.bump = *ctx.bumps.get("pair_config").unwrap();

    Ok(())
}
