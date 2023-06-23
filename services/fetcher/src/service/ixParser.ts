import { BorshCoder, Instruction } from '@coral-xyz/anchor'
import { IDL } from '@dcaf/drip-types'
import {
    AccountMeta,
    CompiledInstruction,
    MessageAccountKeys,
    MessageCompiledInstruction,
    PublicKey,
    VersionedMessage,
    VersionedTransactionResponse,
} from '@solana/web3.js'
import {
    ParsedDeposit,
    ParsedDetokenizeDripPosition,
    ParsedDripIx,
    ParsedInitDripPosition,
    ParsedInitDripPositionNft,
    ParsedInitGlobalConfig,
    ParsedInitPairConfig,
    ParsedToggleAutoCredit,
    ParsedTokenizeDripPosition,
    ParsedUpdateAdmin,
    ParsedUpdateDefaultDripFees,
    ParsedUpdateDefaultPairDripFees,
    ParsedUpdatePythPriceFeed,
    ParsedUpdateSuperAdmin,
    RestError,
} from './types'
import {
    DepositFields,
    InitDripPosition,
    InitGlobalConfig,
    UpdateAdminFields,
    UpdateDefaultDripFeesFields,
    UpdateDefaultPairDripFees,
    UpdateDefaultPairDripFeesFields,
    UpdatePythPriceFeed,
    DripV2InstructionNames,
    InitDripPositionFields,
    InitGlobalConfigFields,
    InitPairConfig,
    UpdateSuperAdmin,
    UpdateAdmin,
    UpdateDefaultDripFees,
    InitDripPositionNft,
    TokenizeDripPosition,
    DetokenizeDripPosition,
    ToggleAutoCredit,
    Deposit,
} from '../generated/anchor/instructions'
import assert from 'assert'
import { programId } from './env'

const dripCoder: BorshCoder = new BorshCoder(IDL)

export function tryDecodeIx(
    tx: VersionedTransactionResponse,
    accountKeys: MessageAccountKeys,
    ix: MessageCompiledInstruction
): Omit<ParsedDripIx, 'index'> | undefined {
    const ixProgram = accountKeys.get(ix.programIdIndex)
    if (ixProgram?.toString() === programId) {
        try {
            return decodeIxToParsedDripIx(tx, ix)
        } catch (e) {
            if ((e as RestError).status >= 500) {
                throw e
            }
            console.error(e)
        }
    }
    return undefined
}

export function decodeIxToParsedDripIx(
    tx: VersionedTransactionResponse,
    ix: MessageCompiledInstruction
): Omit<ParsedDripIx, 'index'> {
    const decodedIx = dripCoder.instruction.decode(
        Buffer.from(ix.data),
        'base58'
    )
    if (!decodedIx) {
        throw RestError.internal(`failed to decode ix`)
    }
    const ixName = decodedIx.name as DripV2InstructionNames
    const accounts = ix.accountKeyIndexes.map((accountIndx) => {
        const pubKey = tx.transaction.message.getAccountKeys().get(accountIndx)
        assert(
            pubKey,
            RestError.internal('unexpected missing account while processing ix')
        )
        return pubKey
    })

    switch (ixName) {
        case 'initGlobalConfig':
            return parseInitGlobalConfig(decodedIx, accounts)
        case 'initPairConfig':
            return parseInitPairConfig(decodedIx, accounts)
        case 'updateSuperAdmin':
            return parseUpdateSuperAdmin(decodedIx, accounts)
        case 'updateAdmin':
            return parseUpdateAdmin(decodedIx, accounts)
        case 'updateDefaultDripFees':
            return parseUpdateDefaultDripFees(decodedIx, accounts)
        case 'updatePythPriceFeed':
            return parseUpdatePythPriceFeed(decodedIx, accounts)
        case 'updateDefaultPairDripFees':
            return parseUpdateDefaultPairDripFees(decodedIx, accounts)
        case 'initDripPosition':
            return parseInitDripPosition(decodedIx, accounts)
        case 'initDripPositionNft':
            return parseInitDripPositionNft(decodedIx, accounts)
        case 'tokenizeDripPosition':
            return parseTokenizeDripPosition(decodedIx, accounts)
        case 'detokenizeDripPosition':
            return parseDetokenizeDripPosition(decodedIx, accounts)
        case 'toggleAutoCredit':
            return parseToggleAutoCredit(decodedIx, accounts)
        case 'deposit':
            return parseDeposit(decodedIx, accounts)
        default:
            if (decodedIx.name in DripV2InstructionNames) {
                // TODO(mocha): update anchor-client-codegen so that this can be caught at compile time
                throw RestError.internal(`unhandled drip`)
            }
    }
    throw RestError.invalid(`invalid ix passed to tryDecodeToParsedDripIx`)
}

function parseDeposit(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedDeposit, 'index'> {
    const parsedIx = Deposit.fromDecoded(ixData.data as DepositFields, accounts)
    return {
        name: DripV2InstructionNames.deposit,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

function parseToggleAutoCredit(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedToggleAutoCredit, 'index'> {
    const parsedIx = ToggleAutoCredit.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.toggleAutoCredit,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseDetokenizeDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedDetokenizeDripPosition, 'index'> {
    const parsedIx = DetokenizeDripPosition.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.detokenizeDripPosition,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseTokenizeDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedTokenizeDripPosition, 'index'> {
    const parsedIx = TokenizeDripPosition.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.tokenizeDripPosition,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseInitDripPositionNft(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedInitDripPositionNft, 'index'> {
    const parsedIx = InitDripPositionNft.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.initDripPositionNft,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseInitDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedInitDripPosition, 'index'> {
    const parsedIx = InitDripPosition.fromDecoded(
        ixData.data as InitDripPositionFields,
        accounts
    )
    return {
        name: DripV2InstructionNames.initDripPosition,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

function parseUpdateDefaultPairDripFees(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedUpdateDefaultPairDripFees, 'index'> {
    const parsedIx = UpdateDefaultPairDripFees.fromDecoded(
        ixData.data as UpdateDefaultPairDripFeesFields,
        accounts
    )
    return {
        name: DripV2InstructionNames.updateDefaultPairDripFees,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

function parseUpdatePythPriceFeed(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedUpdatePythPriceFeed, 'index'> {
    const parsedIx = UpdatePythPriceFeed.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.updatePythPriceFeed,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseUpdateDefaultDripFees(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedUpdateDefaultDripFees, 'index'> {
    const parsedIx = UpdateDefaultDripFees.fromDecoded(
        ixData.data as UpdateDefaultDripFeesFields,
        accounts
    )
    return {
        name: DripV2InstructionNames.updateDefaultDripFees,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

function parseUpdateAdmin(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedUpdateAdmin, 'index'> {
    const parsedIx = UpdateAdmin.fromDecoded(
        ixData.data as UpdateAdminFields,
        accounts
    )
    return {
        name: DripV2InstructionNames.updateAdmin,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

function parseUpdateSuperAdmin(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedUpdateSuperAdmin, 'index'> {
    const parsedIx = UpdateSuperAdmin.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.updateSuperAdmin,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseInitPairConfig(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedInitPairConfig, 'index'> {
    const parsedIx = InitPairConfig.fromDecoded(accounts)
    return {
        name: DripV2InstructionNames.initPairConfig,
        accounts: parsedIx.toAccountsJSON(),
    }
}

function parseInitGlobalConfig(
    ixData: Instruction,
    accounts: PublicKey[]
): Omit<ParsedInitGlobalConfig, 'index'> {
    const parsedIx = InitGlobalConfig.fromDecoded(
        ixData.data as InitGlobalConfigFields,
        accounts
    )
    return {
        name: DripV2InstructionNames.initGlobalConfig,
        accounts: parsedIx.toAccountsJSON(),
        data: parsedIx.toArgsJSON(),
    }
}

export type AccountMetaWithIndex = AccountMeta & {
    accountIndex: number
}

export function getAccountMetas(
    message: VersionedMessage,
    ix: CompiledInstruction
): AccountMetaWithIndex[] {
    return ix.accounts.map((accountIndx) => {
        const pubkey = message.getAccountKeys().get(accountIndx)
        assert(pubkey, RestError.internal('unexpected missing account'))
        return {
            pubkey,
            isSigner: message.isAccountSigner(accountIndx),
            isWritable: message.isAccountWritable(accountIndx),
            accountIndex: accountIndx,
        }
    })
}
