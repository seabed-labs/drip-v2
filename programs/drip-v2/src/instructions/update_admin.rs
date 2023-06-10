use anchor_lang::prelude::*;

use crate::errors::DripError;
use crate::state::{AdminChange, GlobalConfig};

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub global_config: Account<'info, GlobalConfig>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateAdminParams {
    // Anchor doesn't support usize
    pub admin_index: u64,
    pub admin_change: AdminChange,
}

pub fn handle_update_admin(ctx: Context<UpdateAdmin>, params: UpdateAdminParams) -> Result<()> {
    require!(
        ctx.accounts
            .signer
            .key
            .eq(&ctx.accounts.global_config.super_admin),
        DripError::SuperAdminSignatureRequired
    );

    let admin_index: usize = params
        .admin_index
        .try_into()
        .map_err(|_| Result::<()>::Err(DripError::FailedToConvertU64toUSize.into()))
        .unwrap();

    ctx.accounts
        .global_config
        .update_admin(admin_index, params.admin_change)?;

    Ok(())
}
