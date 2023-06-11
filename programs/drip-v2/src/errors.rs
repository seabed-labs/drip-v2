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

    #[msg("Unauthorized; Requires admin permission for this op or super admin signature")]
    OperationUnauthorized, // 6004 or 0x1774

    #[msg("Pyth PriceFeed account serialization not supported")]
    CannotSerializePriceFeedAccount, // 6005 or 0x1775

    #[msg("Error when loading price from Pyth PriceFeed")]
    PythPriceFeedLoadError, // 6006 or 0x1776

    #[msg("Unexpected fee token account")]
    UnexpectedFeeTokenAccount, // 6007 or 0x1777

    #[msg("Fee recipient token account owner does not match")]
    FeeRecipientMismatch, // 6008 or 0x1778

    #[msg("Global config mismatch")]
    GlobalConfigMismatch, // 6009 or 0x1779
}
