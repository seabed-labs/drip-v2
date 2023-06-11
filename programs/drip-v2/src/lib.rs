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

    pub fn init_pair_config(ctx: Context<InitPairConfig>) -> Result<()> {
        handle_init_pair_config(ctx)
    }

    pub fn update_super_admin(
        ctx: Context<UpdateSuperAdmin>,
        params: UpdateSuperAdminParams,
    ) -> Result<()> {
        handle_update_super_admin(ctx, params)
    }

    pub fn update_admin(ctx: Context<UpdateAdmin>, params: UpdateAdminParams) -> Result<()> {
        handle_update_admin(ctx, params)
    }

    // This IX does not retro-actively update drip fees of existing positions
    pub fn update_default_drip_fees(
        ctx: Context<UpdateDefaultDripFees>,
        params: UpdateDefaultDripFeesParams,
    ) -> Result<()> {
        handle_update_default_drip_fees(ctx, params)
    }

    pub fn update_pyth_price_feed(ctx: Context<UpdatePythPriceFeed>) -> Result<()> {
        handle_update_pyth_price_feed(ctx)
    }

    // This IX does not retro-actively update drip fees of existing positions with this pair
    pub fn update_default_pair_drip_fees(
        ctx: Context<UpdateDefaultPairDripFees>,
        params: UpdateDefaultPairDripFeesParams,
    ) -> Result<()> {
        handle_update_default_pair_drip_fees(ctx, params)
    }
}
