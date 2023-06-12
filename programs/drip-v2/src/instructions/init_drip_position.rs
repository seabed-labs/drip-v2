use crate::state::{DripPosition, DripPositionOwner, DripPositionSigner, GlobalConfig};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct InitDripPosition<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub owner: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

    pub input_token_mint: Box<Account<'info, Mint>>,

    pub output_token_mint: Account<'info, Mint>,

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
    pub drip_amount: u64,
    pub frequency_in_seconds: u64,
}

pub fn handle_init_drip_position(
    ctx: Context<InitDripPosition>,
    params: InitDripPositionParams,
) -> Result<()> {
    // TODO: Verifications (if any)

    let drip_position = &mut ctx.accounts.drip_position;
    drip_position.global_config = ctx.accounts.global_config.key();
    drip_position.owner = DripPositionOwner::Direct {
        owner: ctx.accounts.owner.key(),
    };

    drip_position.drip_position_signer = ctx.accounts.drip_position_signer.key();
    // At the program level, auto credit IS NOT coupled to direct/tokenized ownership
    drip_position.auto_credit_enabled = false;
    drip_position.input_token_mint = ctx.accounts.input_token_mint.key();
    drip_position.output_token_mint = ctx.accounts.output_token_mint.key();
    drip_position.input_token_account = ctx.accounts.input_token_account.key();
    drip_position.output_token_account = ctx.accounts.output_token_account.key();
    drip_position.drip_amount = params.drip_amount;
    drip_position.frequency_in_seconds = params.frequency_in_seconds;
    drip_position.total_input_token_dripped = 0;
    drip_position.total_output_token_received = 0;

    let drip_position_signer = &mut ctx.accounts.drip_position_signer;
    drip_position_signer.drip_position = ctx.accounts.drip_position.key();
    drip_position_signer.bump = *ctx.bumps.get("drip_position_signer").unwrap();

    Ok(())
}
