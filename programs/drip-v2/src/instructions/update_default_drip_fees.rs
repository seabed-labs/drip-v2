use anchor_lang::prelude::*;

use crate::errors::DripError;
use crate::state::{AdminPermission, GlobalConfig};

#[derive(Accounts)]
pub struct UpdateDefaultDripFees<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub global_config: Account<'info, GlobalConfig>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateDefaultDripFeesParams {
    pub new_default_drip_fees_bps: u64,
}

pub fn handle_update_default_drip_fees(
    ctx: Context<UpdateDefaultDripFees>,
    params: UpdateDefaultDripFeesParams,
) -> Result<()> {
    require!(
        ctx.accounts
            .global_config
            .is_authorized(&ctx.accounts.signer, AdminPermission::UpdateDefaultDripFees),
        DripError::OperationUnauthorized
    );

    ctx.accounts.global_config.default_drip_fee_bps = params.new_default_drip_fees_bps;

    Ok(())
}
