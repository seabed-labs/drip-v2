use anchor_lang::{prelude::*, Discriminator};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::sysvar::{
    instructions::{get_instruction_relative, Instructions},
    SysvarId,
};

use crate::common::validation::pre_drip_post_drip_have_expected_accounts;
use crate::{
    errors::DripError,
    instruction::PostDrip,
    state::{
        AdminPermission, Authorizer, DripPosition, DripPositionSigner, EphemeralDripState,
        GlobalConfig, PairConfig,
    },
};

// NOTE: When changing this struct, also change validation in post-drip since they are tightly coupled
#[derive(Accounts)]
pub struct PreDrip<'info> {
    // This signer must have the `AdminPermission::Drip` in the global_config referenced in this ix.
    #[account(mut)]
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

    #[account(
        init,
        seeds = [
            b"drip-v2-ephemeral-drip-state",
            drip_position.key().as_ref(),
        ],
        bump,
        payer = drip_authority,
        space = 8 + EphemeralDripState::INIT_SPACE
    )]
    pub ephemeral_drip_state: Box<Account<'info, EphemeralDripState>>,

    #[account(mut)]
    pub drip_position_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub drip_position_output_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub dripper_input_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub dripper_output_token_account: Account<'info, TokenAccount>,

    #[account(address = Instructions::id())]
    /// CHECK: Instructions sysvar
    pub instructions: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,

    /// Accounts not in common with post_drip
    ///
    // The system_program is needed to create the ephemeral state
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PreDripParams {
    pub drip_amount_to_fill: u64,
    pub minimum_output_tokens_expected: u64,
}

pub fn handle_pre_drip(ctx: Context<PreDrip>, params: PreDripParams) -> Result<()> {
    /* Validation */

    require!(
        ctx.accounts
            .drip_authority
            .is_authorized(&ctx.accounts.global_config, AdminPermission::Drip),
        DripError::OperationUnauthorized
    );

    require!(
        ctx.accounts.drip_position.is_activated()?,
        DripError::DripNotActivated
    );

    validate_account_relations(&ctx)?;

    validate_post_drip_ix_present(&ctx)?;

    let drip_position = &ctx.accounts.drip_position;
    require!(
        params.drip_amount_to_fill
            <= drip_position.drip_amount_remaining_post_fees_in_current_cycle,
        DripError::RequestedDripAmountExceedsMaxForPosition
    );

    let drip_position_signer = &ctx.accounts.drip_position_signer;
    let ephemeral_drip_state = &mut ctx.accounts.ephemeral_drip_state;
    let pair_config = &ctx.accounts.pair_config;
    let drip_position_input_token_account = &mut ctx.accounts.drip_position_input_token_account;
    let drip_position_output_token_account = &ctx.accounts.drip_position_output_token_account;
    let dripper_input_token_account = &ctx.accounts.dripper_input_token_account;
    let dripper_output_token_account = &ctx.accounts.dripper_output_token_account;
    let token_program = &ctx.accounts.token_program;

    // TODO(#104): Make sure overflow-checks work in bpf compilation profile too (not just x86 or apple silicon targets)
    //       Else switch to checked math functions.
    // TODO(#105): Move all math here to a custom module to unit test better
    // let partial_drip_amount = params.drip_amount_to_fill;
    let drip_fee_bps = drip_position.drip_fee_bps; // 0 to 10_000 bps
    let input_token_fee_portion_bps = pair_config.input_token_drip_fee_portion_bps; // 0 to 10_000 bps
    let output_token_fee_portion_bps = 10_000 - input_token_fee_portion_bps; // 0 to 10_000 bps
    let input_drip_fee_bps = (drip_fee_bps * input_token_fee_portion_bps) / 10_000;
    let output_drip_fee_bps = (drip_fee_bps * output_token_fee_portion_bps) / 10_000;

    /* STATE UPDATES (EFFECTS) */

    ephemeral_drip_state.bump = *ctx.bumps.get("ephemeral_drip_state").unwrap();
    ephemeral_drip_state.drip_position = drip_position.key();
    ephemeral_drip_state.dripper_input_token_account_balance_pre_drip_balance =
        dripper_input_token_account.amount;
    ephemeral_drip_state.dripper_output_token_account_balance_pre_drip_balance =
        dripper_output_token_account.amount;
    ephemeral_drip_state.drip_position_input_token_account_balance_pre_drip_balance =
        drip_position_input_token_account.amount;
    ephemeral_drip_state.drip_position_output_token_account_balance_pre_drip_balance =
        drip_position_output_token_account.amount;

    // ephemeral_drip_state.input_reserved_for_fees = input_token_fee_amount;
    ephemeral_drip_state.input_transferred_to_dripper = params.drip_amount_to_fill;
    ephemeral_drip_state.minimum_output_expected = params.minimum_output_tokens_expected;
    ephemeral_drip_state.output_drip_fees_bps = output_drip_fee_bps;
    ephemeral_drip_state.input_drip_fees_bps = input_drip_fee_bps;

    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: drip_position_input_token_account.to_account_info(),
                to: dripper_input_token_account.to_account_info(),
                authority: drip_position_signer.to_account_info(),
            },
            &[&[
                b"drip-v2-drip-position-signer".as_ref(),
                drip_position.key().as_ref(),
                &[drip_position_signer.bump],
            ]],
        ),
        params.drip_amount_to_fill,
    )?;

    /* POST CPI VERIFICATION */
    // TODO: Do we really need to validate that the token program transfer is working as expected?
    let pre_drip_input_token_account_balance = drip_position_input_token_account.amount;
    drip_position_input_token_account.reload()?;

    require!(
        pre_drip_input_token_account_balance - drip_position_input_token_account.amount
            == params.drip_amount_to_fill,
        DripError::PreDripInvariantFailed
    );
    /* POST CPI STATE UPDATES (EFFECTS) */

    Ok(())
}

fn validate_account_relations(ctx: &Context<PreDrip>) -> Result<()> {
    let PreDrip {
        global_config,
        pair_config,
        drip_position,
        drip_position_signer,
        drip_position_input_token_account,
        drip_position_output_token_account,
        ..
    } = &ctx.accounts;

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
        drip_position_signer.drip_position.eq(&drip_position.key()),
        DripError::DripPositionSignerMismatch
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

    Ok(())
}

fn validate_post_drip_ix_present(ctx: &Context<PreDrip>) -> Result<()> {
    let mut relative_index_i = 1;
    let current_ix = get_instruction_relative(0, &ctx.accounts.instructions.to_account_info())?;

    loop {
        let ix = get_instruction_relative(
            relative_index_i,
            &ctx.accounts.instructions.to_account_info(),
        );

        let ix = match ix {
            Ok(ix) => ix,
            _ => {
                return err!(DripError::CannotFindPostDripIx);
            }
        };

        if ix.program_id.eq(&crate::id()) && current_ix.program_id.eq(&crate::id()) {
            let actual_discriminator = &ix.data[..8];
            let expected_discrimator = &PostDrip::discriminator();
            if actual_discriminator.eq(expected_discrimator)
                && pre_drip_post_drip_have_expected_accounts(&current_ix, &ix)
            {
                break;
            }
        }

        relative_index_i += 1;
    }

    Ok(())
}
