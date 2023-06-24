'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fromCode =
    exports.CannotCloseDripPositionWithTokens =
    exports.IncorrectAccountsForClosePosition =
    exports.InsufficientInfoForTokenizedOwnerCheck =
    exports.InsufficientInfoForWithdrawal =
    exports.UnexpectedDripPositionNftAccount =
    exports.DripPositionNotTokenized =
    exports.UnexpectedDripPositionInputTokenAccount =
    exports.UnexpectedDripPositionNftMint =
    exports.UnexpectedDripPositionNftAccountOwner =
    exports.DripPositionNftMintAlreadyCreated =
    exports.CannotEnableAutoCreditWithTokenizedPosition =
    exports.DripPositionNftInvariantsFailed =
    exports.CannotTokenizeAutoCreditEnabledDripPosition =
    exports.DripPositionAlreadyTokenized =
    exports.DripPositionOwnerNotSigner =
    exports.DripPositionSignerMismatch =
    exports.GlobalConfigGlobalSignerMismatch =
    exports.GlobalConfigMismatch =
    exports.FeeRecipientMismatch =
    exports.UnexpectedFeeTokenAccount =
    exports.PythPriceFeedLoadError =
    exports.CannotSerializePriceFeedAccount =
    exports.OperationUnauthorized =
    exports.FailedToConvertU64toUSize =
    exports.AdminPubkeyCannotBeDefault =
    exports.AdminIndexOutOfBounds =
    exports.SuperAdminSignatureRequired =
        void 0
class SuperAdminSignatureRequired extends Error {
    constructor(logs) {
        super('6000: Signer is not super_admin')
        this.logs = logs
        this.code = 6000
        this.name = 'SuperAdminSignatureRequired'
        this.msg = 'Signer is not super_admin'
    }
}
exports.SuperAdminSignatureRequired = SuperAdminSignatureRequired
SuperAdminSignatureRequired.code = 6000
class AdminIndexOutOfBounds extends Error {
    constructor(logs) {
        super('6001: Admin index out of bounds')
        this.logs = logs
        this.code = 6001
        this.name = 'AdminIndexOutOfBounds'
        this.msg = 'Admin index out of bounds'
    }
}
exports.AdminIndexOutOfBounds = AdminIndexOutOfBounds
AdminIndexOutOfBounds.code = 6001
class AdminPubkeyCannotBeDefault extends Error {
    constructor(logs) {
        super('6002: Admin pubkey cannot be default')
        this.logs = logs
        this.code = 6002
        this.name = 'AdminPubkeyCannotBeDefault'
        this.msg = 'Admin pubkey cannot be default'
    }
}
exports.AdminPubkeyCannotBeDefault = AdminPubkeyCannotBeDefault
AdminPubkeyCannotBeDefault.code = 6002
class FailedToConvertU64toUSize extends Error {
    constructor(logs) {
        super('6003: Failed to convert u64 to usize')
        this.logs = logs
        this.code = 6003
        this.name = 'FailedToConvertU64toUSize'
        this.msg = 'Failed to convert u64 to usize'
    }
}
exports.FailedToConvertU64toUSize = FailedToConvertU64toUSize
FailedToConvertU64toUSize.code = 6003
class OperationUnauthorized extends Error {
    constructor(logs) {
        super(
            '6004: Unauthorized; Requires admin permission for this op or super admin signature'
        )
        this.logs = logs
        this.code = 6004
        this.name = 'OperationUnauthorized'
        this.msg =
            'Unauthorized; Requires admin permission for this op or super admin signature'
    }
}
exports.OperationUnauthorized = OperationUnauthorized
OperationUnauthorized.code = 6004
class CannotSerializePriceFeedAccount extends Error {
    constructor(logs) {
        super('6005: Pyth PriceFeed account serialization not supported')
        this.logs = logs
        this.code = 6005
        this.name = 'CannotSerializePriceFeedAccount'
        this.msg = 'Pyth PriceFeed account serialization not supported'
    }
}
exports.CannotSerializePriceFeedAccount = CannotSerializePriceFeedAccount
CannotSerializePriceFeedAccount.code = 6005
class PythPriceFeedLoadError extends Error {
    constructor(logs) {
        super('6006: Error when loading price from Pyth PriceFeed')
        this.logs = logs
        this.code = 6006
        this.name = 'PythPriceFeedLoadError'
        this.msg = 'Error when loading price from Pyth PriceFeed'
    }
}
exports.PythPriceFeedLoadError = PythPriceFeedLoadError
PythPriceFeedLoadError.code = 6006
class UnexpectedFeeTokenAccount extends Error {
    constructor(logs) {
        super('6007: Unexpected fee token account')
        this.logs = logs
        this.code = 6007
        this.name = 'UnexpectedFeeTokenAccount'
        this.msg = 'Unexpected fee token account'
    }
}
exports.UnexpectedFeeTokenAccount = UnexpectedFeeTokenAccount
UnexpectedFeeTokenAccount.code = 6007
class FeeRecipientMismatch extends Error {
    constructor(logs) {
        super('6008: Fee recipient token account owner does not match')
        this.logs = logs
        this.code = 6008
        this.name = 'FeeRecipientMismatch'
        this.msg = 'Fee recipient token account owner does not match'
    }
}
exports.FeeRecipientMismatch = FeeRecipientMismatch
FeeRecipientMismatch.code = 6008
class GlobalConfigMismatch extends Error {
    constructor(logs) {
        super('6009: Global config mismatch')
        this.logs = logs
        this.code = 6009
        this.name = 'GlobalConfigMismatch'
        this.msg = 'Global config mismatch'
    }
}
exports.GlobalConfigMismatch = GlobalConfigMismatch
GlobalConfigMismatch.code = 6009
class GlobalConfigGlobalSignerMismatch extends Error {
    constructor(logs) {
        super('6010: Global config and global config signer mismatch')
        this.logs = logs
        this.code = 6010
        this.name = 'GlobalConfigGlobalSignerMismatch'
        this.msg = 'Global config and global config signer mismatch'
    }
}
exports.GlobalConfigGlobalSignerMismatch = GlobalConfigGlobalSignerMismatch
GlobalConfigGlobalSignerMismatch.code = 6010
class DripPositionSignerMismatch extends Error {
    constructor(logs) {
        super('6011: Drip position and drip position signer mismatch')
        this.logs = logs
        this.code = 6011
        this.name = 'DripPositionSignerMismatch'
        this.msg = 'Drip position and drip position signer mismatch'
    }
}
exports.DripPositionSignerMismatch = DripPositionSignerMismatch
DripPositionSignerMismatch.code = 6011
class DripPositionOwnerNotSigner extends Error {
    constructor(logs) {
        super('6012: Drip position owner not a signer')
        this.logs = logs
        this.code = 6012
        this.name = 'DripPositionOwnerNotSigner'
        this.msg = 'Drip position owner not a signer'
    }
}
exports.DripPositionOwnerNotSigner = DripPositionOwnerNotSigner
DripPositionOwnerNotSigner.code = 6012
class DripPositionAlreadyTokenized extends Error {
    constructor(logs) {
        super('6013: Drip position already tokenized')
        this.logs = logs
        this.code = 6013
        this.name = 'DripPositionAlreadyTokenized'
        this.msg = 'Drip position already tokenized'
    }
}
exports.DripPositionAlreadyTokenized = DripPositionAlreadyTokenized
DripPositionAlreadyTokenized.code = 6013
class CannotTokenizeAutoCreditEnabledDripPosition extends Error {
    constructor(logs) {
        super('6014: Cannot tokenize auto-credit enabled drip position')
        this.logs = logs
        this.code = 6014
        this.name = 'CannotTokenizeAutoCreditEnabledDripPosition'
        this.msg = 'Cannot tokenize auto-credit enabled drip position'
    }
}
exports.CannotTokenizeAutoCreditEnabledDripPosition =
    CannotTokenizeAutoCreditEnabledDripPosition
CannotTokenizeAutoCreditEnabledDripPosition.code = 6014
class DripPositionNftInvariantsFailed extends Error {
    constructor(logs) {
        super('6015: Drip position nft mint invariants failed')
        this.logs = logs
        this.code = 6015
        this.name = 'DripPositionNftInvariantsFailed'
        this.msg = 'Drip position nft mint invariants failed'
    }
}
exports.DripPositionNftInvariantsFailed = DripPositionNftInvariantsFailed
DripPositionNftInvariantsFailed.code = 6015
class CannotEnableAutoCreditWithTokenizedPosition extends Error {
    constructor(logs) {
        super('6016: Cannot enable auto-credit with tokenized position')
        this.logs = logs
        this.code = 6016
        this.name = 'CannotEnableAutoCreditWithTokenizedPosition'
        this.msg = 'Cannot enable auto-credit with tokenized position'
    }
}
exports.CannotEnableAutoCreditWithTokenizedPosition =
    CannotEnableAutoCreditWithTokenizedPosition
CannotEnableAutoCreditWithTokenizedPosition.code = 6016
class DripPositionNftMintAlreadyCreated extends Error {
    constructor(logs) {
        super('6017: Drip position NFT mint already created')
        this.logs = logs
        this.code = 6017
        this.name = 'DripPositionNftMintAlreadyCreated'
        this.msg = 'Drip position NFT mint already created'
    }
}
exports.DripPositionNftMintAlreadyCreated = DripPositionNftMintAlreadyCreated
DripPositionNftMintAlreadyCreated.code = 6017
class UnexpectedDripPositionNftAccountOwner extends Error {
    constructor(logs) {
        super('6018: Drip position NFT account owner should be position owner')
        this.logs = logs
        this.code = 6018
        this.name = 'UnexpectedDripPositionNftAccountOwner'
        this.msg = 'Drip position NFT account owner should be position owner'
    }
}
exports.UnexpectedDripPositionNftAccountOwner =
    UnexpectedDripPositionNftAccountOwner
UnexpectedDripPositionNftAccountOwner.code = 6018
class UnexpectedDripPositionNftMint extends Error {
    constructor(logs) {
        super('6019: Drip position NFT mint does not match drip position field')
        this.logs = logs
        this.code = 6019
        this.name = 'UnexpectedDripPositionNftMint'
        this.msg = 'Drip position NFT mint does not match drip position field'
    }
}
exports.UnexpectedDripPositionNftMint = UnexpectedDripPositionNftMint
UnexpectedDripPositionNftMint.code = 6019
class UnexpectedDripPositionInputTokenAccount extends Error {
    constructor(logs) {
        super('6020: Unexpected drip position input token account')
        this.logs = logs
        this.code = 6020
        this.name = 'UnexpectedDripPositionInputTokenAccount'
        this.msg = 'Unexpected drip position input token account'
    }
}
exports.UnexpectedDripPositionInputTokenAccount =
    UnexpectedDripPositionInputTokenAccount
UnexpectedDripPositionInputTokenAccount.code = 6020
class DripPositionNotTokenized extends Error {
    constructor(logs) {
        super('6021: Drip position is not tokenized')
        this.logs = logs
        this.code = 6021
        this.name = 'DripPositionNotTokenized'
        this.msg = 'Drip position is not tokenized'
    }
}
exports.DripPositionNotTokenized = DripPositionNotTokenized
DripPositionNotTokenized.code = 6021
class UnexpectedDripPositionNftAccount extends Error {
    constructor(logs) {
        super('6022: Drip position NFT account does not match mint')
        this.logs = logs
        this.code = 6022
        this.name = 'UnexpectedDripPositionNftAccount'
        this.msg = 'Drip position NFT account does not match mint'
    }
}
exports.UnexpectedDripPositionNftAccount = UnexpectedDripPositionNftAccount
UnexpectedDripPositionNftAccount.code = 6022
class InsufficientInfoForWithdrawal extends Error {
    constructor(logs) {
        super('6023: Insufficient information for withdrawal')
        this.logs = logs
        this.code = 6023
        this.name = 'InsufficientInfoForWithdrawal'
        this.msg = 'Insufficient information for withdrawal'
    }
}
exports.InsufficientInfoForWithdrawal = InsufficientInfoForWithdrawal
InsufficientInfoForWithdrawal.code = 6023
class InsufficientInfoForTokenizedOwnerCheck extends Error {
    constructor(logs) {
        super(
            '6024: Insufficient information for tokenized drip position owner check'
        )
        this.logs = logs
        this.code = 6024
        this.name = 'InsufficientInfoForTokenizedOwnerCheck'
        this.msg =
            'Insufficient information for tokenized drip position owner check'
    }
}
exports.InsufficientInfoForTokenizedOwnerCheck =
    InsufficientInfoForTokenizedOwnerCheck
InsufficientInfoForTokenizedOwnerCheck.code = 6024
class IncorrectAccountsForClosePosition extends Error {
    constructor(logs) {
        super('6025: Incorrect accounts for close_position')
        this.logs = logs
        this.code = 6025
        this.name = 'IncorrectAccountsForClosePosition'
        this.msg = 'Incorrect accounts for close_position'
    }
}
exports.IncorrectAccountsForClosePosition = IncorrectAccountsForClosePosition
IncorrectAccountsForClosePosition.code = 6025
class CannotCloseDripPositionWithTokens extends Error {
    constructor(logs) {
        super(
            '6026: Cannot close position with non-zero input/output token balance'
        )
        this.logs = logs
        this.code = 6026
        this.name = 'CannotCloseDripPositionWithTokens'
        this.msg =
            'Cannot close position with non-zero input/output token balance'
    }
}
exports.CannotCloseDripPositionWithTokens = CannotCloseDripPositionWithTokens
CannotCloseDripPositionWithTokens.code = 6026
function fromCode(code, logs) {
    switch (code) {
        case 6000:
            return new SuperAdminSignatureRequired(logs)
        case 6001:
            return new AdminIndexOutOfBounds(logs)
        case 6002:
            return new AdminPubkeyCannotBeDefault(logs)
        case 6003:
            return new FailedToConvertU64toUSize(logs)
        case 6004:
            return new OperationUnauthorized(logs)
        case 6005:
            return new CannotSerializePriceFeedAccount(logs)
        case 6006:
            return new PythPriceFeedLoadError(logs)
        case 6007:
            return new UnexpectedFeeTokenAccount(logs)
        case 6008:
            return new FeeRecipientMismatch(logs)
        case 6009:
            return new GlobalConfigMismatch(logs)
        case 6010:
            return new GlobalConfigGlobalSignerMismatch(logs)
        case 6011:
            return new DripPositionSignerMismatch(logs)
        case 6012:
            return new DripPositionOwnerNotSigner(logs)
        case 6013:
            return new DripPositionAlreadyTokenized(logs)
        case 6014:
            return new CannotTokenizeAutoCreditEnabledDripPosition(logs)
        case 6015:
            return new DripPositionNftInvariantsFailed(logs)
        case 6016:
            return new CannotEnableAutoCreditWithTokenizedPosition(logs)
        case 6017:
            return new DripPositionNftMintAlreadyCreated(logs)
        case 6018:
            return new UnexpectedDripPositionNftAccountOwner(logs)
        case 6019:
            return new UnexpectedDripPositionNftMint(logs)
        case 6020:
            return new UnexpectedDripPositionInputTokenAccount(logs)
        case 6021:
            return new DripPositionNotTokenized(logs)
        case 6022:
            return new UnexpectedDripPositionNftAccount(logs)
        case 6023:
            return new InsufficientInfoForWithdrawal(logs)
        case 6024:
            return new InsufficientInfoForTokenizedOwnerCheck(logs)
        case 6025:
            return new IncorrectAccountsForClosePosition(logs)
        case 6026:
            return new CannotCloseDripPositionWithTokens(logs)
    }
    return null
}
exports.fromCode = fromCode
//# sourceMappingURL=custom.js.map
