use anchor_lang::{prelude::*, Discriminator};
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use solana_program::sysvar::{
    instructions::{get_instruction_relative, Instructions},
    SysvarId,
};

use crate::{
    errors::DripError,
    instruction::PostDrip,
    state::{
        AdminPermission, Authorizer, DripPosition, DripPositionSigner, EphemeralDripState,
        GlobalConfig, PairConfig,
    },
};

// TODO: On the client-side leverage V0 TX and ALTs to decrease size and increase composability

#[derive(Accounts)]
pub struct PreDrip<'info> {
    pub signer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub input_token_fee_account: Box<Account<'info, TokenAccount>>,

    #[account(
        seeds = [
            b"drip-v2-pair-config",
            drip_position.global_config.key().as_ref(),
            drip_position.input_token_mint.key().as_ref(),
            drip_position.output_token_mint.key().as_ref(),
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

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PreDripParams {
    pub drip_amount_to_fill: u64,
}

pub fn handle_pre_drip(ctx: Context<PreDrip>, params: PreDripParams) -> Result<()> {
    let PreDrip {
        signer,
        global_config,
        pair_config,
        drip_position,
        drip_position_signer,
        drip_position_input_token_account,
        drip_position_output_token_account,
        dripper_input_token_account,
        input_token_fee_account,
        token_program,
        ..
    } = ctx.accounts;

    require!(
        pair_config.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        drip_position.global_config.eq(&global_config.key()),
        DripError::GlobalConfigMismatch
    );

    require!(
        pair_config
            .input_token_mint
            .eq(&drip_position.input_token_mint.key()),
        DripError::PairConfigMismatch
    );

    require!(
        pair_config
            .input_token_mint
            .eq(&drip_position.output_token_mint.key()),
        DripError::PairConfigMismatch
    );

    require!(
        drip_position.ephemeral_drip_state.is_none(),
        DripError::DripAlreadyInProgress
    );

    require!(
        drip_position_input_token_account
            .owner
            .eq(&drip_position_signer.key()),
        DripError::UnexpectedDripPositionInputTokenAccount
    );

    require!(
        drip_position_output_token_account
            .owner
            .eq(&drip_position_signer.key()),
        DripError::UnexpectedDripPositionOutputTokenAccount
    );

    require!(
        params.drip_amount_to_fill
            <= (drip_position.drip_amount - drip_position.drip_amount_filled),
        DripError::DripFillAmountTooHigh
    );

    require!(
        signer.is_authorized(&global_config, AdminPermission::Drip),
        DripError::OperationUnauthorized
    );

    require!(
        dripper_input_token_account.owner.eq(signer.key),
        DripError::InvalidDripperInputTokenAccount
    );

    require!(
        input_token_fee_account
            .owner
            .eq(&global_config.global_config_signer.key()),
        DripError::UnexpectedFeeTokenAccount
    );

    // TODO: Make sure overflow-checks work in bpf compilation profile too (not just x86 or apple silicon targets)
    //       Else switch to checked math functions.
    let partial_drip_amount = params.drip_amount_to_fill;
    let drip_fee_bps = drip_position.drip_fee_bps; // 0 to 10_000 bps
    let input_token_fee_portion_bps = pair_config.input_token_drip_fee_portion_bps; // 0 to 10_000 bps
    let input_drip_fee_bps = (drip_fee_bps * input_token_fee_portion_bps) / 10_000;
    let input_token_fee_amount = (partial_drip_amount * input_drip_fee_bps) / 10_000;
    let post_fees_partial_drip_amount = partial_drip_amount - input_token_fee_amount;
    let pre_drip_input_token_account_balance = drip_position_input_token_account.amount;

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
        post_fees_partial_drip_amount,
    )?;

    token::transfer(
        CpiContext::new_with_signer(
            token_program.to_account_info(),
            Transfer {
                from: drip_position_input_token_account.to_account_info(),
                to: input_token_fee_account.to_account_info(),
                authority: drip_position_signer.to_account_info(),
            },
            &[&[
                b"drip-v2-drip-position-signer".as_ref(),
                drip_position.key().as_ref(),
                &[drip_position_signer.bump],
            ]],
        ),
        input_token_fee_amount,
    )?;

    drip_position_input_token_account.reload()?;

    require!(
        pre_drip_input_token_account_balance - drip_position_input_token_account.amount
            == partial_drip_amount,
        DripError::PreDripInvariantFailed
    );

    ctx.accounts.drip_position.ephemeral_drip_state = Some(EphemeralDripState {
        output_token_account_balance_pre_drip_snapshot: drip_position_output_token_account.amount,
        current_pre_fees_partial_drip_amount: params.drip_amount_to_fill,
    });

    validate_post_drip_ix_present(&ctx)?;

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

            // TODO: Verify this is correct
            if actual_discriminator.eq(expected_discrimator) {
                // Found post-drip IX
                break;
            }
        }

        relative_index_i += 1;
    }

    Ok(())
}
