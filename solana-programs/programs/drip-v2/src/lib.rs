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
// TODO: Add invariant checks to all IXs if needed
// TODO: Be aggressive with signer requirements to avoid accidental unchecked params being blindly used
//       (already done for super admin update and init_drip_position)
// TODO: Make pair config default fees an option to allow globally changing the default by changing field in global config
//       Instead of copying over.
// TODO: Create a Metaplex Collection account when creating a global config to represent all drip positions under that global config.
// TODO: Create a Metaplex Metadata account along with SPL token mint for a tokenized position. Point back to collection.
// TODO: Allow users to specify trade slippage

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

    pub fn update_super_admin(ctx: Context<UpdateSuperAdmin>) -> Result<()> {
        handle_update_super_admin(ctx)
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

    pub fn collect_fees(ctx: Context<CollectFees>, params: CollectFeesParams) -> Result<()> {
        handle_collect_fees(ctx, params)
    }

    pub fn init_drip_position(
        ctx: Context<InitDripPosition>,
        params: InitDripPositionParams,
    ) -> Result<()> {
        handle_init_drip_position(ctx, params)
    }

    pub fn init_drip_position_nft(ctx: Context<InitDripPositionNft>) -> Result<()> {
        handle_init_drip_position_nft(ctx)
    }

    pub fn tokenize_drip_position(ctx: Context<TokenizeDripPosition>) -> Result<()> {
        handle_tokenize_drip_position(ctx)
    }

    pub fn detokenize_drip_position(ctx: Context<DetokenizeDripPosition>) -> Result<()> {
        handle_detokenize_drip_position(ctx)
    }

    pub fn toggle_auto_credit(ctx: Context<ToggleAutoCredit>) -> Result<()> {
        handle_toggle_auto_credit(ctx)
    }

    pub fn deposit(ctx: Context<Deposit>, params: DepositParams) -> Result<()> {
        handle_deposit(ctx, params)
    }

    pub fn withdraw(ctx: Context<Withdraw>, params: WithdrawParams) -> Result<()> {
        handle_withdraw(ctx, params)
    }
}
