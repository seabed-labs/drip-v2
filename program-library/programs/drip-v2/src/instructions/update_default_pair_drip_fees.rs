use anchor_lang::prelude::*;

use crate::errors::DripError;
use crate::state::{AdminPermission, Authorizer, GlobalConfig, PairConfig};

#[derive(Accounts)]
pub struct UpdateDefaultPairDripFees<'info> {
    pub signer: Signer<'info>,

    #[account(
        mut,
        seeds = [
            b"drip-v2-pair-config",
            global_config.key().as_ref(),
            pair_config.input_token_mint.key().as_ref(),
            pair_config.output_token_mint.key().as_ref(),
        ],
        bump = pair_config.bump,
    )]
    pub pair_config: Box<Account<'info, PairConfig>>,

    pub global_config: Box<Account<'info, GlobalConfig>>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateDefaultPairDripFeesParams {
    pub new_default_pair_drip_fees_bps: u16,
}

pub fn handle_update_default_pair_drip_fees(
    ctx: Context<UpdateDefaultPairDripFees>,
    params: UpdateDefaultPairDripFeesParams,
) -> Result<()> {
    require!(
        ctx.accounts.signer.is_authorized(
            &ctx.accounts.global_config,
            AdminPermission::UpdateDefaultPairDripFees
        ),
        DripError::OperationUnauthorized
    );

    ctx.accounts.global_config.default_drip_fee_bps = params.new_default_pair_drip_fees_bps;

    Ok(())
}
