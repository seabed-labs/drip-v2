use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

use crate::errors::DripError;

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
    // We store this separately and not inside the owner enum
    // because we want to preserve it between tokenizations
    pub drip_position_nft_mint: Option<Pubkey>,
}

impl DripPosition {
    pub fn is_tokenized(&self) -> bool {
        match self.owner {
            DripPositionOwner::Tokenized => true,
            _ => false,
        }
    }

    pub fn is_directly_owned_by(&self, signer: Pubkey) -> bool {
        match self.owner {
            DripPositionOwner::Direct { owner } => signer.eq(&owner),
            _ => false,
        }
    }

    pub fn has_associated_nft_mint(&self, nft_mint: &Pubkey) -> bool {
        match self.drip_position_nft_mint {
            Some(key) => key.eq(nft_mint),
            _ => false,
        }
    }

    pub fn is_owned_by_signer<'info>(
        &self,
        signer: &Signer<'info>,
        drip_position_nft_mint: &Option<Account<'info, Mint>>,
        drip_position_nft_account: &Option<Account<'info, TokenAccount>>,
    ) -> Result<bool> {
        match self.owner {
            DripPositionOwner::Tokenized => {
                match (
                    self.drip_position_nft_mint,
                    drip_position_nft_mint,
                    drip_position_nft_account,
                ) {
                    (Some(expected_nft_mint), Some(actual_nft_mint), Some(nft_account)) => {
                        Ok(expected_nft_mint.eq(&actual_nft_mint.key())
                            && actual_nft_mint.key().eq(&nft_account.mint)
                            && signer.key().eq(&nft_account.owner)
                            && nft_account.amount.eq(&1))
                    }
                    _ => return err!(DripError::InsufficientInfoForTokenizedOwnerCheck),
                }
            }
            DripPositionOwner::Direct { owner } => Ok(owner.eq(signer.key)),
        }
    }
}

#[derive(Clone, AnchorSerialize, AnchorDeserialize, InitSpace)]
pub enum DripPositionOwner {
    Direct { owner: Pubkey },
    Tokenized,
}

impl Default for DripPositionOwner {
    fn default() -> Self {
        Self::Direct {
            owner: Pubkey::default(),
        }
    }
}

#[account]
#[derive(Default, InitSpace)]
pub struct DripPositionSigner {
    pub version: u8,
    pub drip_position: Pubkey,
    pub bump: u8,
}

#[account]
#[derive(Default, InitSpace)]
// The goal of this account is to be able to get from the tokenized position NFT pubkey to the position pubkey by walking through an intermediary PDA
pub struct DripPositionNftMapping {
    pub version: u8,
    pub drip_position_nft_mint: Pubkey,
    pub drip_position: Pubkey,
    pub bump: u8,
}
