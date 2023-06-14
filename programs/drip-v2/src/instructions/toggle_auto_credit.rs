use anchor_lang::prelude::*;

use crate::{errors::DripError, state::DripPosition};

#[derive(Accounts)]
pub struct ToggleAutoCredit<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub drip_position: Account<'info, DripPosition>,
}

pub fn handle_toggle_auto_credit(ctx: Context<ToggleAutoCredit>) -> Result<()> {
    if !ctx.accounts.drip_position.auto_credit_enabled {
        // If its not currently enabled, make sure positon is NOT tokenized before enabling
        require!(
            !ctx.accounts.drip_position.is_tokenized(),
            DripError::CannotEnableAutoCreditWithTokenizedPosition
        );
    }

    require!(
        ctx.accounts
            .drip_position
            .is_directly_owned_by(ctx.accounts.signer.key()),
        DripError::DripPositionOwnerNotSigner
    );

    ctx.accounts.drip_position.auto_credit_enabled =
        !ctx.accounts.drip_position.auto_credit_enabled;

    Ok(())
}
