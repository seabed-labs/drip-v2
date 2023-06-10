use anchor_lang::prelude::*;

#[error_code]
pub enum DripError {
    #[msg("Signer is not super_admin")]
    SuperAdminSignatureRequired, // 6000 or 0x1770

    #[msg("Admin index out of bounds")]
    AdminIndexOutOfBounds, // 6001 or 0x1771

    #[msg("SuperAdmin/Admin pubkey cannot be default")]
    AdminPubkeyCannotBeDefault, // 6002 or 0x1772

    #[msg("Failed to convert u64 to usize")]
    FailedToConvertU64toUSize, // 6003 or 0x1773
}
