use crate::{
    errors::DripError,
    state::{AdminPermission, Authorizer, GlobalConfig, GlobalConfigSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

#[derive(Accounts)]
pub struct WithdrawFees<'info> {
    pub signer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(
        seeds = [
            b"drip-v2-global-signer",
            global_config.key().as_ref(),
        ],
        bump = global_config_signer.bump,
    )]
    pub global_config_signer: Account<'info, GlobalConfigSigner>,

    pub fee_token_account: Account<'info, TokenAccount>,

    pub recipient_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct WithdrawFeesParams {
    pub recipient: Pubkey,
}

pub fn handle_withdraw_fees(ctx: Context<WithdrawFees>, params: WithdrawFeesParams) -> Result<()> {
    require!(
        ctx.accounts
            .signer
            .is_authorized(&ctx.accounts.global_config, AdminPermission::WithdrawFees),
        DripError::OperationUnauthorized
    );

    require!(
        ctx.accounts.global_config_signer.global_config == ctx.accounts.global_config.key()
            && ctx.accounts.global_config.global_config_signer
                == ctx.accounts.global_config_signer.key(),
        DripError::GlobalConfigMismatch
    );

    require!(
        ctx.accounts.fee_token_account.owner == ctx.accounts.global_config_signer.key(),
        DripError::UnexpectedFeeTokenAccount
    );

    require!(
        ctx.accounts.recipient_token_account.owner == params.recipient.key(),
        DripError::FeeRecipientMismatch
    );

    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.fee_token_account.to_account_info(),
                to: ctx.accounts.recipient_token_account.to_account_info(),
                authority: ctx.accounts.global_config_signer.to_account_info(),
            },
            &[&[
                b"drip-v2-global-signer".as_ref(),
                ctx.accounts.global_config.key().as_ref(),
                &[ctx.accounts.global_config_signer.bump],
            ]],
        ),
        ctx.accounts.fee_token_account.amount,
    )?;

    Ok(())
}
