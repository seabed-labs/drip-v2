use anchor_lang::prelude::*;

#[error_code]
pub enum DripError {
    #[msg("Signer is not super_admin")]
    SuperAdminSignatureRequired,

    #[msg("Admin index out of bounds")]
    AdminIndexOutOfBounds,

    #[msg("SuperAdmin/Admin pubkey cannot be default")]
    AdminPubkeyCannotBeDefault,

    #[msg("Failed to convert u64 to usize")]
    FailedToConvertU64toUSize,
}
