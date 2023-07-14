use solana_program::instruction::Instruction;

pub fn pre_drip_post_drip_have_expected_accounts(
    pre_drip: &Instruction,
    post_drip: &Instruction,
) -> bool {
    // drip_authority
    pre_drip.accounts[0]
        .pubkey
        .eq(&post_drip.accounts[0].pubkey)
        // global_config
        && pre_drip.accounts[1]
            .pubkey
            .eq(&post_drip.accounts[1].pubkey)
        // pair_config
        && pre_drip.accounts[2]
            .pubkey
            .eq(&post_drip.accounts[2].pubkey)
        // drip_position
        && pre_drip.accounts[3]
            .pubkey
            .eq(&post_drip.accounts[3].pubkey)
        // ephemeral_drip_state
        && pre_drip.accounts[4]
            .pubkey
            .eq(&post_drip.accounts[4].pubkey)
        // drip_position_input_token_account
        && pre_drip.accounts[5]
            .pubkey
            .eq(&post_drip.accounts[5].pubkey)
        // drip_position_output_token_account
        && pre_drip.accounts[6]
            .pubkey
            .eq(&post_drip.accounts[6].pubkey)
        // dripper_input_token_account
        && pre_drip.accounts[7]
            .pubkey
            .eq(&post_drip.accounts[7].pubkey)
        // dripper_output_token_account
        && pre_drip.accounts[8]
            .pubkey
            .eq(&post_drip.accounts[8].pubkey)
        // instructions
        && pre_drip.accounts[9]
            .pubkey
            .eq(&post_drip.accounts[9].pubkey)
        // token_program
        && pre_drip.accounts[10]
            .pubkey
            .eq(&post_drip.accounts[10].pubkey)
}
