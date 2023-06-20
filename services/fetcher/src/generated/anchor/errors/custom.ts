// This file was automatically generated. DO NOT MODIFY DIRECTLY.
export type CustomError =
    | SuperAdminSignatureRequired
    | AdminIndexOutOfBounds
    | AdminPubkeyCannotBeDefault
    | FailedToConvertU64toUSize
    | OperationUnauthorized
    | CannotSerializePriceFeedAccount
    | PythPriceFeedLoadError
    | UnexpectedFeeTokenAccount
    | FeeRecipientMismatch
    | GlobalConfigMismatch
    | GlobalConfigGlobalSignerMismatch
    | DripPositionSignerMismatch
    | DripPositionOwnerNotSigner
    | DripPositionAlreadyTokenized
    | CannotTokenizeAutoCreditEnabledDripPosition
    | DripPositionNftInvariantsFailed
    | CannotEnableAutoCreditWithTokenizedPosition
    | DripPositionNftMintAlreadyCreated
    | UnexpectedDripPositionNftAccountOwner
    | UnexpectedDripPositionNftMint
    | UnexpectedDripPositionInputTokenAccount
    | DripPositionNotTokenized
    | UnexpectedDripPositionNftAccount
    | InsufficientInfoForWithdrawal
    | InsufficientInfoForTokenizedOwnerCheck
    | IncorrectAccountsForClosePosition
    | CannotCloseDripPositionWithTokens
    | CannotFindPostDripIx

export class SuperAdminSignatureRequired extends Error {
    static readonly code = 6000
    readonly code = 6000
    readonly name = 'SuperAdminSignatureRequired'
    readonly msg = 'Signer is not super_admin'

    constructor(readonly logs?: string[]) {
        super('6000: Signer is not super_admin')
    }
}

export class AdminIndexOutOfBounds extends Error {
    static readonly code = 6001
    readonly code = 6001
    readonly name = 'AdminIndexOutOfBounds'
    readonly msg = 'Admin index out of bounds'

    constructor(readonly logs?: string[]) {
        super('6001: Admin index out of bounds')
    }
}

export class AdminPubkeyCannotBeDefault extends Error {
    static readonly code = 6002
    readonly code = 6002
    readonly name = 'AdminPubkeyCannotBeDefault'
    readonly msg = 'Admin pubkey cannot be default'

    constructor(readonly logs?: string[]) {
        super('6002: Admin pubkey cannot be default')
    }
}

export class FailedToConvertU64toUSize extends Error {
    static readonly code = 6003
    readonly code = 6003
    readonly name = 'FailedToConvertU64toUSize'
    readonly msg = 'Failed to convert u64 to usize'

    constructor(readonly logs?: string[]) {
        super('6003: Failed to convert u64 to usize')
    }
}

export class OperationUnauthorized extends Error {
    static readonly code = 6004
    readonly code = 6004
    readonly name = 'OperationUnauthorized'
    readonly msg =
        'Unauthorized; Requires admin permission for this op or super admin signature'

    constructor(readonly logs?: string[]) {
        super(
            '6004: Unauthorized; Requires admin permission for this op or super admin signature'
        )
    }
}

export class CannotSerializePriceFeedAccount extends Error {
    static readonly code = 6005
    readonly code = 6005
    readonly name = 'CannotSerializePriceFeedAccount'
    readonly msg = 'Pyth PriceFeed account serialization not supported'

    constructor(readonly logs?: string[]) {
        super('6005: Pyth PriceFeed account serialization not supported')
    }
}

export class PythPriceFeedLoadError extends Error {
    static readonly code = 6006
    readonly code = 6006
    readonly name = 'PythPriceFeedLoadError'
    readonly msg = 'Error when loading price from Pyth PriceFeed'

    constructor(readonly logs?: string[]) {
        super('6006: Error when loading price from Pyth PriceFeed')
    }
}

export class UnexpectedFeeTokenAccount extends Error {
    static readonly code = 6007
    readonly code = 6007
    readonly name = 'UnexpectedFeeTokenAccount'
    readonly msg = 'Unexpected fee token account'

    constructor(readonly logs?: string[]) {
        super('6007: Unexpected fee token account')
    }
}

export class FeeRecipientMismatch extends Error {
    static readonly code = 6008
    readonly code = 6008
    readonly name = 'FeeRecipientMismatch'
    readonly msg = 'Fee recipient token account owner does not match'

    constructor(readonly logs?: string[]) {
        super('6008: Fee recipient token account owner does not match')
    }
}

export class GlobalConfigMismatch extends Error {
    static readonly code = 6009
    readonly code = 6009
    readonly name = 'GlobalConfigMismatch'
    readonly msg = 'Global config mismatch'

    constructor(readonly logs?: string[]) {
        super('6009: Global config mismatch')
    }
}

export class GlobalConfigGlobalSignerMismatch extends Error {
    static readonly code = 6010
    readonly code = 6010
    readonly name = 'GlobalConfigGlobalSignerMismatch'
    readonly msg = 'Global config and global config signer mismatch'

    constructor(readonly logs?: string[]) {
        super('6010: Global config and global config signer mismatch')
    }
}

export class DripPositionSignerMismatch extends Error {
    static readonly code = 6011
    readonly code = 6011
    readonly name = 'DripPositionSignerMismatch'
    readonly msg = 'Drip position and drip position signer mismatch'

    constructor(readonly logs?: string[]) {
        super('6011: Drip position and drip position signer mismatch')
    }
}

export class DripPositionOwnerNotSigner extends Error {
    static readonly code = 6012
    readonly code = 6012
    readonly name = 'DripPositionOwnerNotSigner'
    readonly msg = 'Drip position owner not a signer'

    constructor(readonly logs?: string[]) {
        super('6012: Drip position owner not a signer')
    }
}

export class DripPositionAlreadyTokenized extends Error {
    static readonly code = 6013
    readonly code = 6013
    readonly name = 'DripPositionAlreadyTokenized'
    readonly msg = 'Drip position already tokenized'

    constructor(readonly logs?: string[]) {
        super('6013: Drip position already tokenized')
    }
}

export class CannotTokenizeAutoCreditEnabledDripPosition extends Error {
    static readonly code = 6014
    readonly code = 6014
    readonly name = 'CannotTokenizeAutoCreditEnabledDripPosition'
    readonly msg = 'Cannot tokenize auto-credit enabled drip position'

    constructor(readonly logs?: string[]) {
        super('6014: Cannot tokenize auto-credit enabled drip position')
    }
}

export class DripPositionNftInvariantsFailed extends Error {
    static readonly code = 6015
    readonly code = 6015
    readonly name = 'DripPositionNftInvariantsFailed'
    readonly msg = 'Drip position nft mint invariants failed'

    constructor(readonly logs?: string[]) {
        super('6015: Drip position nft mint invariants failed')
    }
}

export class CannotEnableAutoCreditWithTokenizedPosition extends Error {
    static readonly code = 6016
    readonly code = 6016
    readonly name = 'CannotEnableAutoCreditWithTokenizedPosition'
    readonly msg = 'Cannot enable auto-credit with tokenized position'

    constructor(readonly logs?: string[]) {
        super('6016: Cannot enable auto-credit with tokenized position')
    }
}

export class DripPositionNftMintAlreadyCreated extends Error {
    static readonly code = 6017
    readonly code = 6017
    readonly name = 'DripPositionNftMintAlreadyCreated'
    readonly msg = 'Drip position NFT mint already created'

    constructor(readonly logs?: string[]) {
        super('6017: Drip position NFT mint already created')
    }
}

export class UnexpectedDripPositionNftAccountOwner extends Error {
    static readonly code = 6018
    readonly code = 6018
    readonly name = 'UnexpectedDripPositionNftAccountOwner'
    readonly msg = 'Drip position NFT account owner should be position owner'

    constructor(readonly logs?: string[]) {
        super('6018: Drip position NFT account owner should be position owner')
    }
}

export class UnexpectedDripPositionNftMint extends Error {
    static readonly code = 6019
    readonly code = 6019
    readonly name = 'UnexpectedDripPositionNftMint'
    readonly msg = 'Drip position NFT mint does not match drip position field'

    constructor(readonly logs?: string[]) {
        super('6019: Drip position NFT mint does not match drip position field')
    }
}

export class UnexpectedDripPositionInputTokenAccount extends Error {
    static readonly code = 6020
    readonly code = 6020
    readonly name = 'UnexpectedDripPositionInputTokenAccount'
    readonly msg = 'Unexpected drip position input token account'

    constructor(readonly logs?: string[]) {
        super('6020: Unexpected drip position input token account')
    }
}

export class DripPositionNotTokenized extends Error {
    static readonly code = 6021
    readonly code = 6021
    readonly name = 'DripPositionNotTokenized'
    readonly msg = 'Drip position is not tokenized'

    constructor(readonly logs?: string[]) {
        super('6021: Drip position is not tokenized')
    }
}

export class UnexpectedDripPositionNftAccount extends Error {
    static readonly code = 6022
    readonly code = 6022
    readonly name = 'UnexpectedDripPositionNftAccount'
    readonly msg = 'Drip position NFT account does not match mint'

    constructor(readonly logs?: string[]) {
        super('6022: Drip position NFT account does not match mint')
    }
}

export class InsufficientInfoForWithdrawal extends Error {
    static readonly code = 6023
    readonly code = 6023
    readonly name = 'InsufficientInfoForWithdrawal'
    readonly msg = 'Insufficient information for withdrawal'

    constructor(readonly logs?: string[]) {
        super('6023: Insufficient information for withdrawal')
    }
}

export class InsufficientInfoForTokenizedOwnerCheck extends Error {
    static readonly code = 6024
    readonly code = 6024
    readonly name = 'InsufficientInfoForTokenizedOwnerCheck'
    readonly msg =
        'Insufficient information for tokenized drip position owner check'

    constructor(readonly logs?: string[]) {
        super(
            '6024: Insufficient information for tokenized drip position owner check'
        )
    }
}

export class IncorrectAccountsForClosePosition extends Error {
    static readonly code = 6025
    readonly code = 6025
    readonly name = 'IncorrectAccountsForClosePosition'
    readonly msg = 'Incorrect accounts for close_position'

    constructor(readonly logs?: string[]) {
        super('6025: Incorrect accounts for close_position')
    }
}

export class CannotCloseDripPositionWithTokens extends Error {
    static readonly code = 6026
    readonly code = 6026
    readonly name = 'CannotCloseDripPositionWithTokens'
    readonly msg =
        'Cannot close position with non-zero input/output token balance'

    constructor(readonly logs?: string[]) {
        super(
            '6026: Cannot close position with non-zero input/output token balance'
        )
    }
}

export class CannotFindPostDripIx extends Error {
    static readonly code = 6027
    readonly code = 6027
    readonly name = 'CannotFindPostDripIx'
    readonly msg = 'Cannot find post-drip IX'

    constructor(readonly logs?: string[]) {
        super('6027: Cannot find post-drip IX')
    }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
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
        case 6027:
            return new CannotFindPostDripIx(logs)
    }

    return null
}
