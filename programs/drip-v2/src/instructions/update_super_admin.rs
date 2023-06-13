use anchor_lang::prelude::*;

use crate::errors::DripError;
use crate::state::GlobalConfig;

#[derive(Accounts)]
pub struct UpdateSuperAdmin<'info> {
    pub signer: Signer<'info>,
    pub new_super_admin: Signer<'info>,

    #[account(mut)]
    pub global_config: Account<'info, GlobalConfig>,
}

pub fn handle_update_super_admin(ctx: Context<UpdateSuperAdmin>) -> Result<()> {
    require!(
        ctx.accounts
            .signer
            .key
            .eq(&ctx.accounts.global_config.super_admin),
        DripError::SuperAdminSignatureRequired
    );

    ctx.accounts.global_config.super_admin = ctx.accounts.new_super_admin.key();

    Ok(())
}
