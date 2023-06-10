use anchor_lang::prelude::*;

#[error_code]
pub enum DripError {
    #[msg("Signer is not admin")]
    AdminSignatureRequired,
}
