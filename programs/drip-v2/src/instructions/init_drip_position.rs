use crate::{
    errors::DripError,
    state::{DripPosition, GlobalConfig, GlobalConfigSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct InitDripPosition<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub owner_nft_holder: Signer<'info>,

    #[account(
        init,
        mint::authority = drip_position,
        mint::decimals = 0,
        payer = payer
    )]
    pub owner_nft_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        associated_token::mint = owner_nft_mint,
        associated_token::authority = owner_nft_holder,
        payer = payer
    )]
    pub owner_nft_account: Box<Account<'info, TokenAccount>>,

    #[account(has_one = global_config_signer @ DripError::GlobalConfigGlobalSignerMismatch)]
    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        seeds = [
            b"drip-v2-global-signer",
            global_config.key().as_ref(),
        ],
        bump = global_config_signer.bump,
        has_one = global_config @ DripError::GlobalConfigGlobalSignerMismatch
    )]
    pub global_config_signer: Box<Account<'info, GlobalConfigSigner>>,

    pub input_token_mint: Account<'info, Mint>,

    pub output_token_mint: Account<'info, Mint>,

    #[account(
        init,
        associated_token::mint = input_token_mint,
        associated_token::authority = drip_position,
        payer = payer
    )]
    pub input_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        associated_token::mint = output_token_mint,
        associated_token::authority = drip_position,
        payer = payer
    )]
    pub output_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        seeds = [
            b"drip-v2-drip-position",
            global_config.key().as_ref(),
            owner_nft_mint.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + DripPosition::INIT_SPACE
    )]
    pub drip_position: Account<'info, DripPosition>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitDripPositionParams {
    pub drip_amount: u64,
    pub frequency_in_seconds: u64,
}

pub fn handle_init_drip(
    ctx: Context<InitDripPosition>,
    params: InitDripPositionParams,
) -> Result<()> {
    // TODO: Verifications (if any)

    let drip_position = &mut ctx.accounts.drip_position;
    drip_position.global_config = ctx.accounts.global_config.key();
    drip_position.owner = ctx.accounts.owner_nft_mint.key();
    drip_position.auto_credit_enabled = false;
    drip_position.input_token_mint = ctx.accounts.input_token_mint.key();
    drip_position.output_token_mint = ctx.accounts.output_token_mint.key();
    drip_position.input_token_account = ctx.accounts.input_token_account.key();
    drip_position.output_token_account = ctx.accounts.output_token_account.key();
    drip_position.drip_amount = params.drip_amount;
    drip_position.frequency_in_seconds = params.frequency_in_seconds;
    drip_position.total_input_token_dripped = 0;
    drip_position.total_output_token_received = 0;
    drip_position.bump = *ctx.bumps.get("drip_position").unwrap();

    Ok(())
}
