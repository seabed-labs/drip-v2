use anchor_lang::prelude::*;

#[error_code]
pub enum DripError {
    #[msg("Signer is not super_admin")]
    SuperAdminSignatureRequired, // 6000 or 0x1770

    #[msg("Admin index out of bounds")]
    AdminIndexOutOfBounds, // 6001 or 0x1771

    #[msg("Admin pubkey cannot be default")]
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

    #[msg("Global config and global config signer mismatch")]
    GlobalConfigSignerMismatch, // 6010 or 0x177A

    #[msg("Drip position and drip position signer mismatch")]
    DripPositionSignerMismatch, // 6011 or 0x177B

    #[msg("Drip position owner not a signer")]
    DripPositionOwnerNotSigner, // 6012 or 0x177C

    #[msg("Drip position already tokenized")]
    DripPositionAlreadyTokenized, // 6013 or 0x177D

    #[msg("Cannot tokenize auto-credit enabled drip position")]
    CannotTokenizeAutoCreditEnabledDripPosition, // 6014 or 0x177E

    #[msg("Drip position nft mint invariants failed")]
    DripPositionNftInvariantsFailed, // 6015 or 0x177F

    #[msg("Cannot enable auto-credit with tokenized position")]
    CannotEnableAutoCreditWithTokenizedPosition, // 6016 or 0x1780

    #[msg("Drip position NFT mint already created")]
    DripPositionNftMintAlreadyCreated, // 6017 or 0x1781

    #[msg("Drip position NFT account owner should be position owner")]
    UnexpectedDripPositionNftAccountOwner, // 6018 or 0x1782

    #[msg("Drip position NFT mint does not match drip position field")]
    UnexpectedDripPositionNftMint, // 6019 or 0x1783

    #[msg("Unexpected drip position input token account")]
    UnexpectedDripPositionInputTokenAccount, // 6020 or 0x1784

    #[msg("Drip position is not tokenized")]
    DripPositionNotTokenized, // 6021 or 0x1785

    #[msg("Drip position NFT account does not match mint")]
    UnexpectedDripPositionNftAccount, // 6022 or 0x1786

    #[msg("Insufficient information for withdrawal")]
    InsufficientInfoForWithdrawal, // 6023 or 0x1787

    #[msg("Insufficient information for tokenized drip position owner check")]
    InsufficientInfoForTokenizedOwnerCheck, // 6024 or 0x1788

    #[msg("Incorrect accounts for close_position")]
    IncorrectAccountsForClosePosition, // 6025 or 0x1789

    #[msg("Cannot close position with non-zero input/output token balance")]
    CannotCloseDripPositionWithTokens, // 6026 or 0x178A

    #[msg("Cannot find post-drip IX")]
    CannotFindPostDripIx, // 6027 or 0x178B

    #[msg("Dripper input token account balance smaller than expected")]
    DripperInputTokenAccountBalanceSmallerThanExpected, // 6028 or 0x178C

    #[msg("Drip already in progress")]
    DripAlreadyInProgress, // 6029 or 0x178D

    #[msg("Drip fill amount higher than remaining amount")]
    DripFillAmountTooHigh, // 6030 or 0x178E

    #[msg("Unexpected drip position output token account")]
    UnexpectedDripPositionOutputTokenAccount, // 6031 or 0x178F

    #[msg("Pair config mismatch")]
    PairConfigMismatch, // 6032 or 0x1790

    #[msg("Pre drip invariant failed")]
    PreDripInvariantFailed, // 6033 or 0x1791

    #[msg("Cannot find pre-drip IX")]
    CannotFindPreDripIx, // 6034 or 0x1792

    #[msg("No drip in progress")]
    NoDripInProgres, // 6035 or 0x1793

    #[msg("Drip not activated yet")]
    DripNotActivated, // 6036 or 0x1794

    #[msg("Expected non-zero received_output_amount post-drip")]
    ExpectedNonZeroOutputPostDrip, // 6037 or 0x1795

    #[msg("Exceeds slippages")]
    ExceededSlippage, // 6038 or 0x1796

    #[msg("Ephemeral drip state and drip position mismatch")]
    EphemeralDripStateDripPositionMismatch, // 6039 or 0x1797

    #[msg("Expected non-zero used_input_amount post-drip")]
    ExpectedNonZeroInputPostDrip, // 6040 or 0x1798

    #[msg("Expected non-zero input/output drip fees")]
    ExpectedNonZeroDripFees, // 6041 or 0x1799

    #[msg("Input drip fees larger then reserved")]
    InputFeesLargerThanReserved, // 6042 or 0x179A

    #[msg("The requested drip amount is larger then the maximum allowable amount for this position cycle")]
    RequestedDripAmountExceedsMaxForPosition, // 6043 or 0x179B
}
