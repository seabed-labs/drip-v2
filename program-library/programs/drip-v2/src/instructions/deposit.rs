use crate::{errors::DripError, state::DripPosition};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct Deposit<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub source_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub drip_position_input_token_account: Account<'info, TokenAccount>,

    pub drip_position: Account<'info, DripPosition>,

    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct DepositParams {
    pub deposit_amount: u64,
}

pub fn handle_deposit(ctx: Context<Deposit>, params: DepositParams) -> Result<()> {
    let (drip_position_signer, _) = Pubkey::find_program_address(
        &[
            b"drip-v2-drip-position-signer",
            ctx.accounts.drip_position.key().as_ref(),
        ],
        &crate::id(),
    );
    require!(
        ctx.accounts
            .drip_position_input_token_account
            .owner
            .eq(&drip_position_signer),
        DripError::UnexpectedDripPositionInputTokenAccount
    );

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.source_input_token_account.to_account_info(),
                to: ctx
                    .accounts
                    .drip_position_input_token_account
                    .to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        params.deposit_amount,
    )?;

    Ok(())
}
