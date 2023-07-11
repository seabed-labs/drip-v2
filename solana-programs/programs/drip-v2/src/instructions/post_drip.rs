use anchor_lang::{prelude::*, Discriminator};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::sysvar::{instructions::get_instruction_relative, SysvarId};

use crate::{
    errors::DripError,
    instruction::PreDrip,
    state::{
        AdminPermission, Authorizer, DripPosition, DripPositionSigner, GlobalConfig, PairConfig,
        PriceOracle,
    },
};

// NOTE: When changing this struct, also change validation in pre-drip since they are tightly coupled
#[derive(Accounts)]
pub struct PostDrip<'info> {
    pub signer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub output_token_fee_account: Box<Account<'info, TokenAccount>>,

    #[account(
        seeds = [
            b"drip-v2-pair-config",
            drip_position.global_config.key().as_ref(),
            pair_config.input_token_mint.key().as_ref(),
            pair_config.output_token_mint.key().as_ref(),
        ],
        bump = pair_config.bump,
    )]
    pub pair_config: Box<Account<'info, PairConfig>>,

    #[account(
        mut,
        has_one = drip_position_signer @ DripError::DripPositionSignerMismatch
    )]
    pub drip_position: Box<Account<'info, DripPosition>>,

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
    pub drip_position_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub drip_position_output_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub dripper_input_token_account: Account<'info, TokenAccount>,

    #[account(address = Instructions::id())]
    /// CHECK: Instructions sysvar
    pub instructions: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handle_post_drip(ctx: Context<PostDrip>) -> Result<()> {
    let PostDrip {
        signer,
        global_config,
        pair_config,
        drip_position,
        drip_position_signer,
        drip_position_input_token_account,
        drip_position_output_token_account,
        dripper_input_token_account,
        output_token_fee_account,
        token_program,
        ..
    } = ctx.accounts;

    require!(
        signer.is_authorized(global_config, AdminPermission::Drip),
        DripError::OperationUnauthorized
    );

    let ephemeral_drip_state = match &drip_position.ephemeral_drip_state {
        Some(ephemeral_drip_state) => ephemeral_drip_state,
        _ => {
            return err!(DripError::NoDripInProgres);
        }
    };

    require!(drip_position.is_activated()?, DripError::DripNotActivated);

    require!(
        pair_config.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        drip_position.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        drip_position.pair_config.eq(&pair_config.key()),
        DripError::PairConfigMismatch
    );

    require!(
        drip_position_input_token_account
            .key()
            .eq(&drip_position.input_token_account),
        DripError::UnexpectedDripPositionInputTokenAccount
    );

    require!(
        drip_position_output_token_account
            .key()
            .eq(&drip_position.output_token_account),
        DripError::UnexpectedDripPositionOutputTokenAccount
    );

    require!(
        dripper_input_token_account.owner.eq(signer.key),
        DripError::InvalidDripperInputTokenAccount
    );

    require!(
        output_token_fee_account
            .owner
            .eq(&global_config.global_config_signer.key()),
        DripError::UnexpectedFeeTokenAccount
    );

    // TODO(#99): These calculations are done in pre-drip. Just store the results in ephemeral state.
    let pre_fees_partal_drip_amount = ephemeral_drip_state.current_pre_fees_partial_drip_amount;
    let drip_fee_bps = drip_position.drip_fee_bps; // 0 to 10_000 bps

    let input_token_fee_portion_bps = pair_config.input_token_drip_fee_portion_bps; // 0 to 10_000 bps
    let input_drip_fee_bps = (drip_fee_bps * input_token_fee_portion_bps) / 10_000;
    let input_token_fee_amount = (pre_fees_partal_drip_amount * input_drip_fee_bps) / 10_000;

    let dripped_input_tokens = pre_fees_partal_drip_amount - input_token_fee_amount;

    let received_output_tokens = drip_position_output_token_account.amount
        - ephemeral_drip_state.output_token_account_balance_pre_drip_snapshot;

    require!(
        received_output_tokens > 0,
        DripError::ExpectedNonZeroOutputPostDrip
    );

    require!(
        received_output_tokens >= ephemeral_drip_state.minimum_output_expected,
        DripError::ExceededSlippage
    );

    let output_token_fee_portion_bps = 10_000 - input_token_fee_portion_bps; // 0 to 10_000 bps
    let output_drip_fee_bps = (drip_fee_bps * output_token_fee_portion_bps) / 10_000;
    let output_token_fee_amount = (received_output_tokens * output_drip_fee_bps) / 10_000;

    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: drip_position_output_token_account.to_account_info(),
                to: output_token_fee_account.to_account_info(),
                authority: drip_position_signer.to_account_info(),
            },
            &[&[
                b"drip-v2-drip-position-signer".as_ref(),
                drip_position.key().as_ref(),
                &[drip_position_signer.bump],
            ]],
        ),
        output_token_fee_amount,
    )?;

    drip_position.drip_amount_filled += ephemeral_drip_state.current_pre_fees_partial_drip_amount;
    drip_position.total_input_token_dripped += pre_fees_partal_drip_amount;
    drip_position.total_output_token_received += received_output_tokens;
    drip_position.ephemeral_drip_state = None;

    if ctx.accounts.drip_position.drip_amount_filled == ctx.accounts.drip_position.drip_amount {
        ctx.accounts
            .drip_position
            .advance_drip_activation_timestamp()?;
    }

    // TODO(#100): Refactor the function so that it can be called at the top of the handler
    //       Right now there's issues with borrowing if we try to do that.
    validate_pre_drip_ix_present(&ctx)?;

    // TODO(#100): Refactor the function so that it can be called at the top of the handler
    //       Right now there's issues with borrowing if we try to do that.
    validate_price_constraints(&ctx, received_output_tokens, dripped_input_tokens)?;

    // TODO(#101): Support auto-credit flow (not critical, skipping for now)

    Ok(())
}

fn validate_pre_drip_ix_present(ctx: &Context<PostDrip>) -> Result<()> {
    let mut relative_index_i = -1;
    let current_ix = get_instruction_relative(0, &ctx.accounts.instructions.to_account_info())?;

    loop {
        let ix = get_instruction_relative(
            relative_index_i,
            &ctx.accounts.instructions.to_account_info(),
        );

        let ix = match ix {
            Ok(ix) => ix,
            _ => {
                return err!(DripError::CannotFindPreDripIx);
            }
        };

        if ix.program_id.eq(&crate::id()) && current_ix.program_id.eq(&crate::id()) {
            let actual_discriminator = &ix.data[..8];
            let expected_discrimator = &PreDrip::discriminator();

            if actual_discriminator.eq(expected_discrimator) {
                let pre_drip_accounts_match_expectation = {
                    ctx.accounts.signer.key().eq(&ix.accounts[0].pubkey)
                        && ctx.accounts.global_config.key().eq(&ix.accounts[1].pubkey)
                        && ctx.accounts.pair_config.key().eq(&ix.accounts[3].pubkey)
                        && ctx.accounts.drip_position.key().eq(&ix.accounts[4].pubkey)
                        && ctx
                            .accounts
                            .drip_position_signer
                            .key()
                            .eq(&ix.accounts[5].pubkey)
                        && ctx
                            .accounts
                            .drip_position_input_token_account
                            .key()
                            .eq(&ix.accounts[6].pubkey)
                        && ctx
                            .accounts
                            .drip_position_output_token_account
                            .key()
                            .eq(&ix.accounts[7].pubkey)
                        && ctx
                            .accounts
                            .dripper_input_token_account
                            .key()
                            .eq(&ix.accounts[8].pubkey)
                        && ctx.accounts.instructions.key().eq(&ix.accounts[9].pubkey)
                        && ctx.accounts.token_program.key().eq(&ix.accounts[10].pubkey)
                };

                if pre_drip_accounts_match_expectation {
                    break;
                }
            }
        }

        relative_index_i -= 1;
    }

    Ok(())
}

fn validate_price_constraints(
    ctx: &Context<PostDrip>,
    _received_output_tokens: u64,
    _dripped_input_tokens: u64,
) -> Result<()> {
    match (
        &ctx.accounts.pair_config.input_token_price_oracle,
        &ctx.accounts.pair_config.output_token_price_oracle,
    ) {
        // TODO(#102): Add logs
        (PriceOracle::Unavailable, PriceOracle::Unavailable) => {}
        (PriceOracle::Unavailable, _) => {}
        (_, PriceOracle::Unavailable) => {}
        // TODO(#107): Handle
        _ => todo!("price oracles not implemented"),
    }

    // TODO(#103): Apart from oracle deviation (defined in position),
    //       this can also validate other price-based conditions
    //       defined by the position owner.

    Ok(())
}
