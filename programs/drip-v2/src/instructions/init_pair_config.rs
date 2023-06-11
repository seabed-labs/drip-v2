use crate::{
    errors::DripError,
    state::{AdminPermission, GlobalConfig, PairConfig, PriceFeed, PriceOracle},
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;

#[derive(Accounts)]
pub struct InitPairConfig<'info> {
    pub signer: Signer<'info>,

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

    pub input_token_pyth_price_feed: Option<Account<'info, PriceFeed>>,
    pub output_token_pyth_price_feed: Option<Account<'info, PriceFeed>>,

    pub system_program: Program<'info, System>,
}

pub fn handle_init_pair_config(ctx: Context<InitPairConfig>) -> Result<()> {
    require!(
        ctx.accounts
            .global_config
            .is_authorized(&ctx.accounts.signer, AdminPermission::InitPairConfig),
        DripError::OperationUnauthorized
    );

    ctx.accounts.pair_config.input_token_mint = ctx.accounts.input_token_mint.key();
    ctx.accounts.pair_config.output_token_mint = ctx.accounts.output_token_mint.key();
    ctx.accounts.pair_config.bump = *ctx.bumps.get("pair_config").unwrap();

    ctx.accounts.pair_config.input_token_price_oracle = ctx
        .accounts
        .input_token_pyth_price_feed
        .as_ref()
        .map_or(PriceOracle::Unavailable, |price_feed| PriceOracle::Pyth {
            pyth_price_feed_account: price_feed.key(),
        });

    ctx.accounts.pair_config.output_token_price_oracle = ctx
        .accounts
        .output_token_pyth_price_feed
        .as_ref()
        .map_or(PriceOracle::Unavailable, |price_feed| PriceOracle::Pyth {
            pyth_price_feed_account: price_feed.key(),
        });

    Ok(())
}
