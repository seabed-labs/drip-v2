use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionOwner, DripPositionSigner, GlobalConfig, PairConfig},
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

    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        seeds = [
            b"drip-v2-pair-config",
            global_config.key().as_ref(),
            input_token_mint.key().as_ref(),
            output_token_mint.key().as_ref(),
        ],
        bump = pair_config.bump,
    )]
    pub pair_config: Box<Account<'info, PairConfig>>,

    pub input_token_mint: Box<Account<'info, Mint>>,

    pub output_token_mint: Box<Account<'info, Mint>>,

    #[account(
        init,
        associated_token::mint = input_token_mint,
        associated_token::authority = drip_position_signer,
        payer = payer
    )]
    pub input_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        associated_token::mint = output_token_mint,
        associated_token::authority = drip_position_signer,
        payer = payer
    )]
    pub output_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = payer,
        space = 8 + DripPosition::INIT_SPACE
    )]
    pub drip_position: Account<'info, DripPosition>,

    #[account(
        init,
        seeds = [
            b"drip-v2-drip-position-signer",
            drip_position.key().as_ref(),
        ],
        bump,
        payer = payer,
        space = 8 + DripPositionSigner::INIT_SPACE
    )]
    pub drip_position_signer: Account<'info, DripPositionSigner>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitDripPositionParams {
    pub owner: Pubkey,
    pub drip_amount: u64,
    pub frequency_in_seconds: u64,
}

pub fn handle_init_drip_position(
    ctx: Context<InitDripPosition>,
    params: InitDripPositionParams,
) -> Result<()> {
    // TODO: Verifications (if any left)
    require!(
        ctx.accounts
            .pair_config
            .global_config
            .eq(&ctx.accounts.global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        ctx.accounts
            .pair_config
            .input_token_mint
            .eq(&ctx.accounts.input_token_mint.key()),
        DripError::PairConfigMismatch
    );

    require!(
        ctx.accounts
            .pair_config
            .output_token_mint
            .eq(&ctx.accounts.output_token_mint.key()),
        DripError::PairConfigMismatch
    );

    let drip_position = &mut ctx.accounts.drip_position;
    drip_position.global_config = ctx.accounts.global_config.key();
    drip_position.owner = DripPositionOwner::Direct {
        owner: params.owner,
    };

    drip_position.drip_fee_bps = ctx.accounts.pair_config.default_pair_drip_fee_bps;

    drip_position.drip_position_signer = ctx.accounts.drip_position_signer.key();
    // At the program level, auto credit IS NOT coupled to direct/tokenized ownership
    drip_position.auto_credit_enabled = false;
    drip_position.input_token_mint = ctx.accounts.input_token_mint.key();
    drip_position.output_token_mint = ctx.accounts.output_token_mint.key();
    drip_position.input_token_account = ctx.accounts.input_token_account.key();
    drip_position.output_token_account = ctx.accounts.output_token_account.key();
    drip_position.drip_amount = params.drip_amount;
    drip_position.pair_config = ctx.accounts.pair_config.key();
    drip_position.frequency_in_seconds = params.frequency_in_seconds;
    drip_position.total_input_token_dripped = 0;
    drip_position.total_output_token_received = 0;
    drip_position.init_drip_timestamps()?;

    let drip_position_signer = &mut ctx.accounts.drip_position_signer;
    drip_position_signer.drip_position = ctx.accounts.drip_position.key();
    drip_position_signer.bump = *ctx.bumps.get("drip_position_signer").unwrap();

    Ok(())
}
