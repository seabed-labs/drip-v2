import {
    DripPositionJSON,
    DripPositionNftMappingJSON,
    DripPositionSignerJSON,
    GlobalConfigJSON,
    GlobalConfigSignerJSON,
    PairConfigJSON,
} from '../generated/anchor/accounts'
import {
    DepositAccountsJSON,
    DepositFieldsJSON,
    DetokenizeDripPositionAccountsJSON,
    DripV2InstructionNames,
    InitDripPositionAccountsJSON,
    InitDripPositionFieldsJSON,
    UpdateDefaultPairDripFeesAccountsJSON,
    UpdateDefaultPairDripFeesFieldsJSON,
    InitDripPositionNftAccountsJSON,
    InitGlobalConfigAccountsJSON,
    InitGlobalConfigFieldsJSON,
    InitPairConfigAccountsJSON,
    ToggleAutoCreditAccountsJSON,
    TokenizeDripPositionAccountsJSON,
    UpdateAdminAccountsJSON,
    UpdateDefaultDripFeesAccountsJSON,
    UpdateDefaultDripFeesFieldsJSON,
    UpdatePythPriceFeedAccountsJSON,
    UpdateSuperAdminAccountsJSON,
} from '../generated/anchor/instructions'
import * as RestErrors from 'restify-errors'

////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////

export class InvalidAccountError extends RestErrors.UnprocessableEntityError {
    constructor(discriminator: Buffer) {
        super(`unknown discriminator ${discriminator.toString('hex')}`)
    }
}

export class InvalidOwnerError extends RestErrors.InvalidArgumentError {
    constructor(account: string, owner: string, expectedOwner: string) {
        super(
            `account ${account} was expected to be owned by ${expectedOwner} but it is owned by ${owner}`
        )
    }
}

export class RpcNotFoundError extends RestErrors.NotFoundError {
    constructor(identifier: string) {
        super(`account or tx identified by ${identifier} was not found`)
    }
}

export class FailedToDecodeError extends RestErrors.InternalServerError {
    constructor() {
        super(`failed to decode ix`)
    }
}

////////////////////////////////////////////////////////////////
// Parameters
////////////////////////////////////////////////////////////////

export type Commitment = 'confirmed' | 'finalized'

////////////////////////////////////////////////////////////////
// Responses
////////////////////////////////////////////////////////////////

export type PingResponse = ResponseCommon<{
    message: string
}>

export type ParsedAccountResponse = ResponseCommon<{
    publicKey: string
    name:
        | 'DripPosition'
        | 'DripPositionNftMapping'
        | 'DripPositionSigner'
        | 'GlobalConfig'
        | 'GlobalConfigSigner'
        | 'PairConfig'
    account:
        | DripPositionJSON
        | DripPositionNftMappingJSON
        | DripPositionSignerJSON
        | GlobalConfigJSON
        | GlobalConfigSignerJSON
        | PairConfigJSON
}>

export type ParsedTxResponse = ResponseCommon<{
    signature: string
    instructions: {
        index: number
        /* Undefined represents an ix we are unable to parse at this time*/
        parsedIx?: ParsedDripIx
    }[]
}>

////////////////////////////////////////////////////////////////
// Misc
////////////////////////////////////////////////////////////////

export type ResponseCommon<T extends object> =
    | {
          serverTimestamp: number
          data: T
          error?: unknown
      }
    | {
          serverTimestamp: number
          data?: T
          error: unknown
      }

export type ParsedIx<A, T = undefined> = {
    accounts: A
    data: T
}

export type ParsedIxWithMetadata<A, N extends string, T = undefined> = ParsedIx<
    A,
    T
> & {
    name: N
}

export type ParsedDeposit = ParsedIxWithMetadata<
    DepositAccountsJSON,
    DripV2InstructionNames.deposit,
    DepositFieldsJSON
>

export type ParsedDetokenizeDripPosition = ParsedIxWithMetadata<
    DetokenizeDripPositionAccountsJSON,
    DripV2InstructionNames.detokenizeDripPosition
>

export type ParsedInitDripPosition = ParsedIxWithMetadata<
    InitDripPositionAccountsJSON,
    DripV2InstructionNames.initDripPosition,
    InitDripPositionFieldsJSON
>

export type ParsedInitDripPositionNft = ParsedIxWithMetadata<
    InitDripPositionNftAccountsJSON,
    DripV2InstructionNames.initDripPositionNft
>

export type ParsedInitGlobalConfig = ParsedIxWithMetadata<
    InitGlobalConfigAccountsJSON,
    DripV2InstructionNames.initGlobalConfig,
    InitGlobalConfigFieldsJSON
>

export type ParsedInitPairConfig = ParsedIxWithMetadata<
    InitPairConfigAccountsJSON,
    DripV2InstructionNames.initPairConfig
>

export type ParsedToggleAutoCredit = ParsedIxWithMetadata<
    ToggleAutoCreditAccountsJSON,
    DripV2InstructionNames.toggleAutoCredit
>

export type ParsedTokenizeDripPosition = ParsedIxWithMetadata<
    TokenizeDripPositionAccountsJSON,
    DripV2InstructionNames.tokenizeDripPosition
>

export type ParsedUpdateAdmin = ParsedIxWithMetadata<
    UpdateAdminAccountsJSON,
    DripV2InstructionNames.updateAdmin,
    // Note: openapi does not have support for tuples!
    unknown
>

export type ParsedUpdateDefaultDripFees = ParsedIxWithMetadata<
    UpdateDefaultDripFeesAccountsJSON,
    DripV2InstructionNames.updateDefaultDripFees,
    UpdateDefaultDripFeesFieldsJSON
>

export type ParsedUpdateDefaultPairDripFees = ParsedIxWithMetadata<
    UpdateDefaultPairDripFeesAccountsJSON,
    DripV2InstructionNames.updateDefaultPairDripFees,
    UpdateDefaultPairDripFeesFieldsJSON
>

export type ParsedUpdatePythPriceFeed = ParsedIxWithMetadata<
    UpdatePythPriceFeedAccountsJSON,
    DripV2InstructionNames.updatePythPriceFeed
>

export type ParsedUpdateSuperAdmin = ParsedIxWithMetadata<
    UpdateSuperAdminAccountsJSON,
    DripV2InstructionNames.updateSuperAdmin
>

export type ParsedDripIx =
    | ParsedDeposit
    | ParsedDetokenizeDripPosition
    | ParsedInitDripPosition
    | ParsedInitDripPositionNft
    | ParsedInitGlobalConfig
    | ParsedInitPairConfig
    | ParsedToggleAutoCredit
    | ParsedTokenizeDripPosition
    | ParsedUpdateAdmin
    | ParsedUpdateDefaultDripFees
    | ParsedUpdateDefaultPairDripFees
    | ParsedUpdatePythPriceFeed
    | ParsedUpdateSuperAdmin
