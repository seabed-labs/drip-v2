use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionOwner, DripPositionSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, CloseAccount, Mint, Token, TokenAccount};

#[derive(Accounts)]
pub struct DetokenizeDripPosition<'info> {
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

    #[account(mut)]
    pub drip_position_nft_mint: Account<'info, Mint>,

    #[account(mut)]
    pub drip_position_nft_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

pub fn handle_detokenize_drip_position(ctx: Context<DetokenizeDripPosition>) -> Result<()> {
    require!(
        ctx.accounts.drip_position.is_tokenized(),
        DripError::DripPositionNotTokenized
    );

    require!(
        ctx.accounts
            .drip_position
            .has_associated_nft_mint(&ctx.accounts.drip_position_nft_mint.key()),
        DripError::UnexpectedDripPositionNftMint
    );

    require!(
        ctx.accounts
            .drip_position_nft_account
            .mint
            .eq(&ctx.accounts.drip_position_nft_mint.key()),
        DripError::UnexpectedDripPositionNftAccount
    );

    require!(
        ctx.accounts
            .drip_position_nft_account
            .owner
            .eq(ctx.accounts.owner.key)
            && ctx.accounts.drip_position_nft_account.amount.eq(&1),
        DripError::UnexpectedDripPositionNftAccountOwner
    );

    ctx.accounts.drip_position.owner = DripPositionOwner::Direct {
        owner: ctx.accounts.owner.key(),
    };

    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.drip_position_nft_mint.to_account_info(),
                from: ctx.accounts.drip_position_nft_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        ),
        1,
    )?;

    token::close_account(CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        CloseAccount {
            account: ctx.accounts.drip_position_nft_account.to_account_info(),
            destination: ctx.accounts.owner.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    ))?;

    ctx.accounts.drip_position_nft_mint.reload()?;

    require!(
        ctx.accounts.drip_position_nft_mint.supply == 0,
        DripError::DripPositionNftInvariantsFailed
    );

    Ok(())
}
