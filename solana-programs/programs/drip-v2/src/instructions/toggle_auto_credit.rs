use anchor_lang::prelude::*;

use crate::state::DripPosition;

#[derive(Accounts)]
pub struct ToggleAutoCredit<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub drip_position: Account<'info, DripPosition>,
}

pub fn handle_toggle_auto_credit(ctx: Context<ToggleAutoCredit>) -> Result<()> {
    ctx.accounts.drip_position.auto_credit_enabled =
        !ctx.accounts.drip_position.auto_credit_enabled;

    Ok(())
}
