use anchor_lang::prelude::*;
use anchor_spl::token::spl_token::instruction::AuthorityType;
use anchor_spl::token::{self, CloseAccount, Mint, SetAuthority, Token, TokenAccount};

use crate::errors::DripError;
use crate::state::{DripPosition, DripPositionNftMapping, DripPositionSigner};

#[derive(Accounts)]
pub struct ClosePosition<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        mut,
        close = signer,
        has_one = drip_position_signer @ DripError::DripPositionSignerMismatch
    )]
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

    #[account(mut)]
    pub drip_position_nft_mint: Option<Account<'info, Mint>>,

    #[account(mut)]
    pub drip_position_nft_account: Option<Account<'info, TokenAccount>>,

    // TODO: We can't do a PDA check easily because the dependency drip_position_nft_mint is
    // optional
    #[account(
        mut,
        close = signer
    )]
    pub drip_position_nft_mapping: Option<Account<'info, DripPositionNftMapping>>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_close_position(ctx: Context<ClosePosition>) -> Result<()> {
    require!(
        ctx.accounts
            .drip_position
            .is_directly_owned_by(ctx.accounts.signer.key()),
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
        drip_position_nft_mint,
        drip_position_nft_account,
        token_program,
        drip_position_nft_mapping,
    } = ctx.accounts;

    match (
        drip_position.drip_position_nft_mint,
        drip_position_nft_mint,
        drip_position_nft_account,
        drip_position_nft_mapping,
    ) {
        (
            Some(drip_position_nft_mint_pubkey),
            Some(drip_position_nft_mint_account),
            Some(drip_position_nft_token_account),
            Some(drip_position_nft_mapping),
        ) if drip_position_nft_mint_pubkey.eq(&drip_position_nft_mint_account.key())
            && drip_position_nft_token_account
                .mint
                .eq(&drip_position_nft_mint_pubkey)
            && drip_position_nft_mapping
                .drip_position_nft_mint
                .eq(&drip_position_nft_mint_pubkey)
            && drip_position_nft_mapping
                .drip_position
                .eq(&drip_position.key()) =>
        {
            // If it isn't owned by the signer, it'll fail anyways - so no need to check
            token::close_account(CpiContext::new(
                token_program.to_account_info(),
                CloseAccount {
                    account: drip_position_nft_token_account.to_account_info(),
                    destination: signer.to_account_info(),
                    authority: signer.to_account_info(),
                },
            ))?;

            token::set_authority(
                CpiContext::new_with_signer(
                    token_program.to_account_info(),
                    SetAuthority {
                        current_authority: drip_position_signer.to_account_info(),
                        account_or_mint: drip_position_nft_mint_account.to_account_info(),
                    },
                    &[&[
                        b"drip-v2-drip-position-signer".as_ref(),
                        drip_position.key().as_ref(),
                        &[drip_position_signer.bump],
                    ]],
                ),
                AuthorityType::MintTokens,
                None,
            )?;
        }
        (None, _, _, None) => {
            // Do nothing if we're not expecting an nft and mapping is none (if mapping isn't none,
            // we may accidentally close another mapping)
        }
        _ => return err!(DripError::IncorrectAccountsForClosePosition),
    }

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
