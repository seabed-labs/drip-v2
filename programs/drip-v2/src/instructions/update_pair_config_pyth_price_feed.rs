use crate::{
    errors::DripError,
    state::{AdminPermission, GlobalConfig, PairConfig, PriceFeed},
};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdatePairConfigPythPriceFeed<'info> {
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

pub fn handle_update_pair_config_pyth_price_feed(
    ctx: Context<UpdatePairConfigPythPriceFeed>,
) -> Result<()> {
    require!(
        ctx.accounts.global_config.is_authorized(
            &ctx.accounts.signer,
            AdminPermission::UpdatePairConfigPythPriceFeed
        ),
        DripError::OperationUnauthorized
    );

    match &ctx.accounts.pyth_price_feed {
        Some(pyth_price_feed) => {
            ctx.accounts.pair_config.pyth_price_feed = Some(pyth_price_feed.key());
        }
        None => {
            ctx.accounts.pair_config.pyth_price_feed = None;
        }
    }

    Ok(())
}
