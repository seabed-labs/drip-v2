use crate::{
    errors::DripError,
    state::{AdminPermission, GlobalConfig, PairConfig, PriceFeed},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdatePythPriceFeed<'info> {
    pub signer: Signer<'info>,

    pub global_config: Account<'info, GlobalConfig>,

    #[account(
        mut,
        seeds = [
            b"drip-v2-pair-config",
            global_config.key().as_ref(),
            pair_config.input_mint.key().as_ref(),
            pair_config.output_mint.key().as_ref(),
        ],
        bump = pair_config.bump,
    )]
    pub pair_config: Account<'info, PairConfig>,

    pub pyth_price_feed: Option<Account<'info, PriceFeed>>,
}

pub fn handle_update_pyth_price_feed(ctx: Context<UpdatePythPriceFeed>) -> Result<()> {
    require!(
        ctx.accounts.global_config.is_authorized(
            &ctx.accounts.signer,
            AdminPermission::UpdatePairConfigPythPriceFeed
        ),
        DripError::OperationUnauthorized
    );

    ctx.accounts.pair_config.pyth_price_feed = ctx
        .accounts
        .pyth_price_feed
        .as_ref()
        .map_or(None, |p| Some(p.key()));

    Ok(())
}
