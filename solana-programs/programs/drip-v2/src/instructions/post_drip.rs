use anchor_lang::{prelude::*, Discriminator};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::sysvar::{instructions::get_instruction_relative, SysvarId};

use crate::common::validation::pre_drip_post_drip_have_expected_accounts;
use crate::state::EphemeralDripState;
use crate::{
    errors::DripError,
    instruction::PreDrip,
    state::{AdminPermission, Authorizer, DripPosition, GlobalConfig, PairConfig, PriceOracle},
};

// NOTE: When changing this struct, also change validation in pre-drip since they are tightly coupled
#[derive(Accounts)]
pub struct PostDrip<'info> {
    /// Accounts common with pre_drip

    ///
    // This signer must have the `AdminPermission::Drip` in the global_config referenced in this ix.
    // This signer must have delegate access to the dripper input/output token accounts if they exist.
    pub drip_authority: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

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

    #[account(mut)]
    pub drip_position: Box<Account<'info, DripPosition>>,

    // This account is expected to have been created in the pre_drip instruction.
    #[account(
        mut,
        seeds = [
            b"drip-v2-ephemeral-drip-state",
            drip_position.key().as_ref(),
        ],
        bump = ephemeral_drip_state.bump,
        has_one = drip_position @ DripError::EphemeralDripStateDripPositionMismatch,
        close = drip_authority
    )]
    pub ephemeral_drip_state: Box<Account<'info, EphemeralDripState>>,

    #[account(mut)]
    pub drip_position_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub drip_position_output_token_account: Account<'info, TokenAccount>,

    // TODO: Handle potentially closed input token accounts
    #[account(mut)]
    pub dripper_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub dripper_output_token_account: Account<'info, TokenAccount>,

    #[account(address = Instructions::id())]
    /// CHECK: Instructions sysvar
    pub instructions: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    /// Accounts not in common with pre_drip

    ///
    // This account must be owned by the gobal_config.global_config_signer.
    #[account(mut)]
    pub output_token_fee_account: Box<Account<'info, TokenAccount>>,
}

pub fn handle_post_drip(ctx: Context<PostDrip>) -> Result<()> {
    /* Validation */
    let global_config = &ctx.accounts.global_config;
    let drip_authority = &ctx.accounts.drip_authority;
    let drip_position = &ctx.accounts.drip_position;
    let ephemeral_drip_state = &ctx.accounts.ephemeral_drip_state;
    let output_token_fee_account = &ctx.accounts.output_token_fee_account;
    let dripper_input_token_account = &ctx.accounts.dripper_input_token_account;
    let dripper_output_token_account = &ctx.accounts.dripper_output_token_account;
    let drip_position_output_token_account = &ctx.accounts.drip_position_output_token_account;
    let drip_position_input_token_account = &ctx.accounts.drip_position_input_token_account;
    let token_program = &ctx.accounts.token_program;

    validate_account_relations(&ctx)?;

    validate_pre_drip_ix_present(&ctx)?;

    require!(
        drip_authority.is_authorized(global_config, AdminPermission::Drip),
        DripError::OperationUnauthorized
    );

    require!(drip_position.is_activated()?, DripError::DripNotActivated);

    // dripper_input_token_account.amount will always be >= dripper_input_token_account_balance_pre_drip_balance
    require!(
        dripper_input_token_account.amount
            >= ephemeral_drip_state.dripper_input_token_account_balance_pre_drip_balance,
        DripError::DripperInputTokenAccountBalanceSmallerThanExpected
    );

    let unused_input_token_amount = if dripper_input_token_account.amount
        > ephemeral_drip_state.dripper_input_token_account_balance_pre_drip_balance
    {
        dripper_input_token_account.amount
            - ephemeral_drip_state.dripper_input_token_account_balance_pre_drip_balance
    } else {
        0
    };

    let position_drip_amount_used =
        ephemeral_drip_state.input_transferred_to_dripper - unused_input_token_amount;

    let position_drip_amount_filled_with_fees =
        ephemeral_drip_state.input_transferred_to_fee_account + position_drip_amount_used;

    require!(
        position_drip_amount_filled_with_fees > 0,
        DripError::ExpectedNonZeroInputPostDrip
    );

    let dripper_received_output_tokens = dripper_output_token_account.amount
        - ephemeral_drip_state.dripper_output_token_account_balance_pre_drip_balance;

    require!(
        dripper_received_output_tokens > 0,
        DripError::ExpectedNonZeroOutputPostDrip
    );

    require!(
        dripper_received_output_tokens >= ephemeral_drip_state.minimum_output_expected,
        DripError::ExceededSlippage
    );

    validate_price_constraints(
        &ctx,
        dripper_received_output_tokens,
        position_drip_amount_used,
    )?;

    let output_token_amount_to_send_to_fee_account =
        (dripper_received_output_tokens * ephemeral_drip_state.output_drip_fees_bps) / 10_000;

    let output_token_amount_to_send_to_position =
        dripper_received_output_tokens - output_token_amount_to_send_to_fee_account;

    /* STATE UPDATES (EFFECTS) */

    let drip_position = &mut ctx.accounts.drip_position;

    // all totals are before protocol fees
    drip_position.drip_amount_filled += position_drip_amount_filled_with_fees;
    drip_position.total_input_token_dripped += position_drip_amount_filled_with_fees;
    drip_position.total_output_token_received += dripper_received_output_tokens;

    if drip_position.drip_amount_filled == drip_position.drip_amount {
        drip_position.drip_activation_timestamp =
            drip_position.get_next_drip_activation_timestamp()?;
        drip_position.drip_amount_filled = 0;
    }

    /* MANUAL CPI (INTERACTIONS) */

    // send output token to position
    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: dripper_output_token_account.to_account_info(),
                to: drip_position_output_token_account.to_account_info(),
                authority: drip_authority.to_account_info(),
            },
            &[],
        ),
        output_token_amount_to_send_to_position,
    )?;

    // send unused input to position
    if unused_input_token_amount != 0 {
        token::transfer(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                Transfer {
                    from: dripper_input_token_account.to_account_info(),
                    to: drip_position_input_token_account.to_account_info(),
                    authority: drip_authority.to_account_info(),
                },
                &[],
            ),
            unused_input_token_amount,
        )?;
    }

    // send output token protocol fees
    if output_token_amount_to_send_to_fee_account != 0 {
        token::transfer(
            CpiContext::new_with_signer(
                token_program.to_account_info(),
                Transfer {
                    from: dripper_output_token_account.to_account_info(),
                    to: output_token_fee_account.to_account_info(),
                    authority: drip_authority.to_account_info(),
                },
                &[],
            ),
            output_token_amount_to_send_to_fee_account,
        )?;
    }
    // TODO(#101): Support auto-credit flow (not critical, skipping for now)

    /* POST CPI VERIFICATION */
    /* POST CPI STATE UPDATES (EFFECTS) */

    Ok(())
}

fn validate_account_relations(ctx: &Context<PostDrip>) -> Result<()> {
    let PostDrip {
        global_config,
        pair_config,
        drip_position,
        drip_position_input_token_account,
        drip_position_output_token_account,
        output_token_fee_account,
        ephemeral_drip_state,
        ..
    } = &ctx.accounts;

    require!(
        drip_position.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        drip_position.pair_config.eq(&pair_config.key()),
        DripError::PairConfigMismatch
    );

    require!(
        ephemeral_drip_state.drip_position.eq(&drip_position.key()),
        DripError::EphemeralDripStateDripPositionMismatch
    );

    require!(
        pair_config.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
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
        output_token_fee_account
            .owner
            .eq(&global_config.global_config_signer.key()),
        DripError::UnexpectedFeeTokenAccount
    );
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
            if actual_discriminator.eq(expected_discrimator)
                && pre_drip_post_drip_have_expected_accounts(&ix, &current_ix)
            {
                break;
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
