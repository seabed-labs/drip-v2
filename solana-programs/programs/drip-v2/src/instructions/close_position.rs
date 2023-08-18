use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Token, TokenAccount};

use crate::errors::DripError;
use crate::state::{DripPosition, DripPositionSigner};

#[derive(Accounts)]
pub struct ClosePosition<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    pub drip_position: Box<Account<'info, DripPosition>>,

    #[account(
        mut,
        close = signer,
        seeds = [
            b"drip-v2-drip-position-signer",
            drip_position.key().as_ref(),
        ],
        bump = drip_position_signer.bump,
        has_one = drip_position @ DripError::DripPositionSignerMismatch
    )]
    pub drip_position_signer: Box<Account<'info, DripPositionSigner>>,

    #[account(mut)]
    pub drip_position_input_token_account: Box<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub drip_position_output_token_account: Box<Account<'info, TokenAccount>>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_close_position(ctx: Context<ClosePosition>) -> Result<()> {
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
            .owner
            .eq(&ctx.accounts.signer.key()),
        DripError::DripPositionOwnerNotSigner
    );

    require!(
        ctx.accounts.drip_position_input_token_account.amount.eq(&0)
            && ctx
                .accounts
                .drip_position_output_token_account
                .amount
                .eq(&0),
        DripError::CannotCloseDripPositionWithTokens
    );

    let ClosePosition {
        signer,
        drip_position,
        drip_position_signer,
        drip_position_input_token_account,
        drip_position_output_token_account,
        token_program,
    } = ctx.accounts;

    // If it isn't owned by the signer, it'll fail anyways - so no need to check
    token::close_account(CpiContext::new_with_signer(
        token_program.to_account_info(),
        CloseAccount {
            account: drip_position_input_token_account.to_account_info(),
            destination: signer.to_account_info(),
            authority: drip_position_signer.to_account_info(),
        },
        &[&[
            b"drip-v2-drip-position-signer".as_ref(),
            drip_position.key().as_ref(),
            &[drip_position_signer.bump],
        ]],
    ))?;

    token::close_account(CpiContext::new_with_signer(
        token_program.to_account_info(),
        CloseAccount {
            account: drip_position_output_token_account.to_account_info(),
            destination: signer.to_account_info(),
            authority: drip_position_signer.to_account_info(),
        },
        &[&[
            b"drip-v2-drip-position-signer".as_ref(),
            drip_position.key().as_ref(),
            &[drip_position_signer.bump],
        ]],
    ))?;

    Ok(())
}
