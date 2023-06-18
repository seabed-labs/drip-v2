use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub destination_input_token_account: Option<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub destination_output_token_account: Option<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub drip_position_input_token_account: Option<Account<'info, TokenAccount>>,

    #[account(mut)]
    pub drip_position_output_token_account: Option<Account<'info, TokenAccount>>,

    #[account(
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

    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct WithdrawParams {
    pub withdraw_input_amount: u64,
    pub withdraw_output_amount: u64,
}

pub fn handle_withdraw(ctx: Context<Withdraw>, params: WithdrawParams) -> Result<()> {
    withdraw_tokens(
        &ctx.accounts.token_program,
        &ctx.accounts.drip_position,
        &ctx.accounts.drip_position_signer,
        &mut ctx.accounts.drip_position_input_token_account,
        &mut ctx.accounts.destination_input_token_account,
        params.withdraw_input_amount,
    )?;

    withdraw_tokens(
        &ctx.accounts.token_program,
        &ctx.accounts.drip_position,
        &ctx.accounts.drip_position_signer,
        &mut ctx.accounts.drip_position_output_token_account,
        &mut ctx.accounts.destination_output_token_account,
        params.withdraw_output_amount,
    )?;

    Ok(())
}

fn withdraw_tokens<'a, 'info>(
    token_program: &'a Program<'info, Token>,
    drip_position: &'a Account<'info, DripPosition>,
    drip_position_signer: &'a Account<'info, DripPositionSigner>,
    source: &'a mut Option<Account<'info, TokenAccount>>,
    destination: &'a mut Option<Account<'info, TokenAccount>>,
    amount: u64,
) -> Result<()> {
    match (source, destination, amount) {
        (Some(source), Some(destination), amount) if amount > 0 => {
            token::transfer(
                CpiContext::new_with_signer(
                    token_program.to_account_info(),
                    Transfer {
                        from: source.to_account_info(),
                        to: destination.to_account_info(),
                        authority: drip_position_signer.to_account_info(),
                    },
                    &[&[
                        b"drip-v2-drip-position-signer".as_ref(),
                        drip_position.key().as_ref(),
                        &[drip_position_signer.bump],
                    ]],
                ),
                amount,
            )?;

            Ok(())
        }
        (_, _, amount) if amount > 0 => {
            return err!(DripError::InsufficientInfoForWithdrawal);
        }
        _ => Ok(()),
    }
}
