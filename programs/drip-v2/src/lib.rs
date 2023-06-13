pub mod errors;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;
use instructions::*;

declare_id!("74XYB4agZ83msRxmTGvNDc8D2z8T55mfGfz3FAneNSKk");

// TODO: Check and ensure exhaustive validations for each IX in its handler
// TODO: Add exhaustive integration tests
// TODO: Add SDK support + happy path SDK tests
// TODO: Make sure all IXs support token 2022 (use interfaces, tried but was erroring out - might be a version issue?)

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

    pub fn withdraw_fees(ctx: Context<WithdrawFees>, params: WithdrawFeesParams) -> Result<()> {
        handle_withdraw_fees(ctx, params)
    }

    pub fn init_drip_position(
        ctx: Context<InitDripPosition>,
        params: InitDripPositionParams,
    ) -> Result<()> {
        handle_init_drip_position(ctx, params)
    }

    pub fn tokenize_drip_position(ctx: Context<TokenizeDripPosition>) -> Result<()> {
        handle_tokenize_drip_position(ctx)
    }
}
