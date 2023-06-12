use anchor_lang::prelude::*;

#[account]
#[derive(Default, InitSpace)]
pub struct DripPosition {
    pub global_config: Pubkey,
    pub owner: DripPositionOwner,
    pub drip_position_signer: Pubkey,
    pub auto_credit_enabled: bool,
    pub input_token_mint: Pubkey,
    pub output_token_mint: Pubkey,
    pub input_token_account: Pubkey,
    pub output_token_account: Pubkey,
    pub drip_amount: u64,
    pub frequency_in_seconds: u64,
    pub total_input_token_dripped: u64,
    pub total_output_token_received: u64,
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, InitSpace)]
pub enum DripPositionOwner {
    Direct { owner: Pubkey },
    Tokenized { owner_nft_mint: Pubkey },
}

impl Default for DripPositionOwner {
    fn default() -> Self {
        Self::Tokenized {
            owner_nft_mint: Pubkey::default(),
        }
    }
}

#[account]
#[derive(Default, InitSpace)]
pub struct DripPositionSigner {
    pub drip_position: Pubkey,
    pub bump: u8,
}
