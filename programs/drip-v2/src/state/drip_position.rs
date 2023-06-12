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

impl DripPosition {
    pub fn is_tokenized(&self) -> bool {
        match self.owner {
            DripPositionOwner::Direct { .. } => false,
            DripPositionOwner::Tokenized { .. } => true,
        }
    }
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

#[account]
#[derive(Default, InitSpace)]
// The goal of this account is to be able to get from the tokenized position NFT pubkey to the position pubkey by walking through an intermediary PDA
pub struct DripPositionNftMapping {
    pub drip_position_nft_mint: Pubkey,
    pub drip_position: Pubkey,
}
