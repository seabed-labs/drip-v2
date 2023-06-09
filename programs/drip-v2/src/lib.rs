pub mod state;

use anchor_lang::prelude::*;
use state::{GlobalConfig, GLOBAL_CONFIG_SPACE};

declare_id!("74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk");

#[program]
pub mod drip_v2 {
    use super::*;

    pub fn init_global_config(
        ctx: Context<InitGlobalConfig>,
        initial_state: GlobalConfig,
    ) -> Result<()> {
        ctx.accounts.global_config.set_inner(initial_state);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitGlobalConfig<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(init, payer = payer, space = GLOBAL_CONFIG_SPACE)]
    pub global_config: Account<'info, GlobalConfig>,

    pub system_program: Program<'info, System>,
}
