use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionNftMapping, DripPositionOwner, DripPositionSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self, Mint, MintTo, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct TokenizeDripPosition<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub owner: Signer<'info>,

    #[account(
        mut,
        has_one = drip_position_signer @ DripError::DripPositionSignerMismatch
    )]
    pub drip_position: Account<'info, DripPosition>,

    #[account(
        seeds = [
            b"drip-v2-drip-position-signer",
            drip_position.key().as_ref(),
        ],
        bump = drip_position_signer.bump,
        has_one = drip_position @ DripError::DripPositionSignerMismatch
    )]
    pub drip_position_signer: Account<'info, DripPositionSigner>,

    #[account(
        init,
        mint::authority = drip_position_signer,
        mint::decimals = 0,
        payer = payer
    )]
    pub drip_position_nft_mint: Account<'info, Mint>,

    #[account(
        init,
        associated_token::mint = drip_position_nft_mint,
        associated_token::authority = owner,
        payer = payer
    )]
    pub drip_position_nft_account: Account<'info, TokenAccount>,

    #[account(
        init,
        seeds = [
            b"drip-v2-drip-position-nft-mapping",
            drip_position_nft_mint.key().as_ref()
        ],
        bump,
        payer = payer,
        space = 8 + DripPositionNftMapping::INIT_SPACE
    )]
    pub drip_position_nft_mapping: Account<'info, DripPositionNftMapping>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

pub fn handle_tokenize_drip_position(ctx: Context<TokenizeDripPosition>) -> Result<()> {
    require!(
        !ctx.accounts.drip_position.is_tokenized(),
        DripError::DripPositionAlreadyTokenized
    );

    require!(
        !ctx.accounts.drip_position.auto_credit_enabled,
        DripError::CannotTokenizeAutoCreditEnabledDripPosition
    );

    ctx.accounts.drip_position.owner = DripPositionOwner::Tokenized {
        owner_nft_mint: ctx.accounts.drip_position_nft_mint.key(),
    };

    ctx.accounts
        .drip_position_nft_mapping
        .drip_position_nft_mint = ctx.accounts.drip_position_nft_mint.key();

    ctx.accounts.drip_position_nft_mapping.drip_position = ctx.accounts.drip_position.key();

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.drip_position_nft_mint.to_account_info(),
                to: ctx.accounts.drip_position_nft_account.to_account_info(),
                authority: ctx.accounts.drip_position_signer.to_account_info(),
            },
            &[&[
                b"drip-v2-drip-position-signer".as_ref(),
                ctx.accounts.drip_position.key().as_ref(),
                &[ctx.accounts.drip_position_signer.bump],
            ]],
        ),
        1,
    )?;

    ctx.accounts.drip_position_nft_mint.reload()?;

    require!(
        ctx.accounts.drip_position_nft_mint.supply == 1,
        DripError::DripPositionNftSupplyInvariantFailed
    );

    Ok(())
}
