use anchor_lang::{prelude::*, Discriminator};
use solana_program::sysvar::{
    instructions::{get_instruction_relative, load_current_index_checked, Instructions},
    SysvarId,
};

use crate::{errors::DripError, instruction::PostDrip};

#[derive(Accounts)]
pub struct PreDrip<'info> {
    pub signer: Signer<'info>,

    #[account(address = Instructions::id())]
    /// CHECK: Instructions sysvar
    pub instructions: UncheckedAccount<'info>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PreDripParams {
    pub x: u64,
}

pub fn handle_pre_drip(ctx: Context<PreDrip>, params: PreDripParams) -> Result<()> {
    let mut relative_index_i = 1;

    let current_ix = get_instruction_relative(0, &ctx.accounts.instructions.to_account_info())?;

    loop {
        let ix = get_instruction_relative(
            relative_index_i,
            &ctx.accounts.instructions.to_account_info(),
        );

        let ix = match ix {
            Ok(ix) => ix,
            _ => {
                return err!(DripError::CannotFindPostDripIx);
            }
        };

        if ix.program_id.eq(&crate::id()) && current_ix.program_id.eq(&crate::id()) {
            let actual_discriminator = &ix.data[..8];
            let expected_discrimator = &PostDrip::discriminator();

            if actual_discriminator.eq(expected_discrimator) {
                // Post drip exists
                break;
            }
        }

        relative_index_i += 1;
    }

    // TODO

    Ok(())
}
