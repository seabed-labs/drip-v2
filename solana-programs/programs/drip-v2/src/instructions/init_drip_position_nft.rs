use crate::{
    errors::DripError,
    state::{DripPosition, DripPositionNftMapping, DripPositionSigner},
};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

#[derive(Accounts)]
pub struct InitDripPositionNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

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
}

pub fn handle_init_drip_position_nft(ctx: Context<InitDripPositionNft>) -> Result<()> {
    require!(
        ctx.accounts.drip_position.drip_position_nft_mint.is_none(),
        DripError::DripPositionNftMintAlreadyCreated
    );

    ctx.accounts
        .drip_position_nft_mapping
        .drip_position_nft_mint = ctx.accounts.drip_position_nft_mint.key();

    ctx.accounts.drip_position_nft_mapping.drip_position = ctx.accounts.drip_position.key();

    ctx.accounts.drip_position.drip_position_nft_mint =
        Some(ctx.accounts.drip_position_nft_mint.key());

    ctx.accounts.drip_position_nft_mapping.bump =
        *ctx.bumps.get("drip_position_nft_mapping").unwrap();

    Ok(())
}
