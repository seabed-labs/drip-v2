use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionOwner, DripPositionSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};

#[derive(Accounts)]
pub struct TokenizeDripPosition<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub owner: Signer<'info>,

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

    #[account(mut)]
    pub drip_position_nft_mint: Account<'info, Mint>,

    #[account(mut)]
    pub drip_position_nft_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handle_tokenize_drip_position(ctx: Context<TokenizeDripPosition>) -> Result<()> {
    require!(
        ctx.accounts
            .drip_position
            .key()
            .eq(&ctx.accounts.drip_position_signer.drip_position),
        DripError::DripPositionSignerMismatch
    );
    require!(
        ctx.accounts
            .drip_position
            .is_directly_owned_by(ctx.accounts.owner.key()),
        DripError::DripPositionOwnerNotSigner
    );

    require!(
        !ctx.accounts.drip_position.is_tokenized(),
        DripError::DripPositionAlreadyTokenized
    );

    require!(
        ctx.accounts
            .drip_position_nft_account
            .owner
            .eq(ctx.accounts.owner.key),
        DripError::UnexpectedDripPositionNftAccountOwner
    );

    require!(
        ctx.accounts
            .drip_position
            .has_associated_nft_mint(&ctx.accounts.drip_position_nft_mint.key()),
        DripError::UnexpectedDripPositionNftMint
    );

    // We don't want auto-credits to be enabled for tokenized positions.
    // The reason is that the token account we credit to then becomes dynamic and that increases complexity.
    // If a user wants to move an auto-credit enabled position, disable it, tokenize, move, de-tokenize and then re-enable it.
    require!(
        !ctx.accounts.drip_position.auto_credit_enabled,
        DripError::CannotTokenizeAutoCreditEnabledDripPosition
    );

    ctx.accounts.drip_position.owner = DripPositionOwner::Tokenized;

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
    ctx.accounts.drip_position_nft_account.reload()?;

    require!(
        ctx.accounts.drip_position_nft_mint.supply == 1
            && ctx.accounts.drip_position_nft_account.amount == 1
            && ctx
                .accounts
                .drip_position_nft_account
                .owner
                .eq(ctx.accounts.owner.key)
            && ctx
                .accounts
                .drip_position_nft_mint
                .mint_authority
                .contains(&ctx.accounts.drip_position_signer.key()),
        DripError::DripPositionNftInvariantsFailed
    );

    Ok(())
}
