use anchor_lang::prelude::*;

use crate::errors::DripError;
use crate::state::GlobalConfig;

#[derive(Accounts)]
pub struct UpdateSuperAdmin<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub global_config: Account<'info, GlobalConfig>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateSuperAdminParams {
    pub new_super_admin: Pubkey,
}

pub fn handle_update_super_admin(
    ctx: Context<UpdateSuperAdmin>,
    params: UpdateSuperAdminParams,
) -> Result<()> {
    require!(
        ctx.accounts
            .signer
            .key
            .eq(&ctx.accounts.global_config.super_admin),
        DripError::SuperAdminSignatureRequired
    );

    require!(
        params.new_super_admin.ne(&Pubkey::default()),
        DripError::AdminPubkeyCannotBeDefault
    );

    ctx.accounts.global_config.super_admin = params.new_super_admin;

    Ok(())
}
