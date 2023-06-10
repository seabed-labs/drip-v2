pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk");

#[program]
pub mod drip_v2 {
    use super::*;

    pub fn init_global_config(
        ctx: Context<InitGlobalConfig>,
        params: InitGlobalConfigParams,
    ) -> Result<()> {
        handle_init_global_config(ctx, params)
    }
}
