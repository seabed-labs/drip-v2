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

// NOTE: When changing this struct, also change validation in post-drip since they are tightly coupled
#[derive(Accounts)]
pub struct PreDrip<'info> {
    pub signer: Signer<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    pub global_config: Box<Account<'info, GlobalConfig>>,

    #[account(mut)]
    pub input_token_fee_account: Box<Account<'info, TokenAccount>>,

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
        payer = payer,
        space = 8 + EphemeralDripState::INIT_SPACE
    )]
    pub ephemeral_drip_state: Box<Account<'info, EphemeralDripState>>,

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

    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct PreDripParams {
    pub drip_amount_to_fill: u64,
    pub minimum_output_tokens_expected: u64,
}

pub fn handle_pre_drip(ctx: Context<PreDrip>, params: PreDripParams) -> Result<()> {
    /* Validation */

    validate_account_relations(&ctx)?;

    require!(
        params.drip_amount_to_fill
            <= (ctx.accounts.drip_position.drip_amount
                - ctx.accounts.drip_position.drip_amount_filled),
        DripError::DripFillAmountTooHigh
    );

    validate_post_drip_ix_present(&ctx)?;

    /* STATE UPDATES (EFFECTS) */
    let ephemeral_drip_state = &mut ctx.accounts.ephemeral_drip_state;
    let drip_position_input_token_account = &mut ctx.accounts.drip_position_input_token_account;

    let drip_position = &ctx.accounts.drip_position;
    let drip_position_signer = &ctx.accounts.drip_position_signer;
    let pair_config = &ctx.accounts.pair_config;
    let drip_position_output_token_account = &ctx.accounts.drip_position_output_token_account;
    let dripper_input_token_account = &ctx.accounts.dripper_input_token_account;
    let input_token_fee_account = &ctx.accounts.input_token_fee_account;
    let token_program = &ctx.accounts.token_program;

    // TODO(#104): Make sure overflow-checks work in bpf compilation profile too (not just x86 or apple silicon targets)
    //       Else switch to checked math functions.
    // TODO(#105): Move all math here to a custom module to unit test better
    let partial_drip_amount = params.drip_amount_to_fill;
    let drip_fee_bps = drip_position.drip_fee_bps; // 0 to 10_000 bps
    let input_token_fee_portion_bps = pair_config.input_token_drip_fee_portion_bps; // 0 to 10_000 bps
    let input_drip_fee_bps = (drip_fee_bps * input_token_fee_portion_bps) / 10_000;
    let input_token_fee_amount = (partial_drip_amount * input_drip_fee_bps) / 10_000;
    let post_fees_partial_drip_amount = partial_drip_amount - input_token_fee_amount;

    ephemeral_drip_state.bump = *ctx.bumps.get("ephemeral_drip_state").unwrap();
    ephemeral_drip_state.drip_position = drip_position.key();
    ephemeral_drip_state.output_token_account_balance_pre_drip_snapshot =
        drip_position_output_token_account.amount;
    ephemeral_drip_state.minimum_output_expected = params.minimum_output_tokens_expected;
    ephemeral_drip_state.pre_fees_partial_drip_amount = params.drip_amount_to_fill;
    ephemeral_drip_state.dripped_input_tokens = post_fees_partial_drip_amount;

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

    /* POST CPI VERIFICATION */
    let pre_drip_input_token_account_balance = drip_position_input_token_account.amount;
    drip_position_input_token_account.reload()?;

    require!(
        pre_drip_input_token_account_balance - drip_position_input_token_account.amount
            == partial_drip_amount,
        DripError::PreDripInvariantFailed
    );
    /* POST CPI STATE UPDATES (EFFECTS) */

    Ok(())
}

fn validate_account_relations(ctx: &Context<PreDrip>) -> Result<()> {
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
        ..
    } = &ctx.accounts;

    require!(
        signer.is_authorized(global_config, AdminPermission::Drip),
        DripError::OperationUnauthorized
    );

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

            if actual_discriminator.eq(expected_discrimator) {
                let post_drip_accounts_match_expectation = {
                    ctx.accounts.signer.key().eq(&ix.accounts[0].pubkey)
                        && ctx.accounts.global_config.key().eq(&ix.accounts[2].pubkey)
                        && ctx.accounts.pair_config.key().eq(&ix.accounts[4].pubkey)
                        && ctx.accounts.drip_position.key().eq(&ix.accounts[5].pubkey)
                        && ctx
                            .accounts
                            .drip_position_signer
                            .key()
                            .eq(&ix.accounts[6].pubkey)
                        && ctx
                            .accounts
                            .ephemeral_drip_state
                            .key()
                            .eq(&ix.accounts[7].pubkey)
                        && ctx
                            .accounts
                            .drip_position_input_token_account
                            .key()
                            .eq(&ix.accounts[8].pubkey)
                        && ctx
                            .accounts
                            .drip_position_output_token_account
                            .key()
                            .eq(&ix.accounts[9].pubkey)
                        && ctx
                            .accounts
                            .dripper_input_token_account
                            .key()
                            .eq(&ix.accounts[10].pubkey)
                        && ctx.accounts.instructions.key().eq(&ix.accounts[11].pubkey)
                        && ctx.accounts.token_program.key().eq(&ix.accounts[12].pubkey)
                };

                if post_drip_accounts_match_expectation {
                    break;
                }
            }
        }

        relative_index_i += 1;
    }

    Ok(())
}
