import assert from 'assert';

import { BorshCoder, Instruction } from '@coral-xyz/anchor';
import { IDL } from '@dcaf/drip-types/src/drip_v2';
import {
    DepositArgs,
    InitDripPosition,
    InitGlobalConfig,
    UpdateAdminArgs,
    UpdateDefaultDripFeesArgs,
    UpdateDefaultPairDripFees,
    UpdateDefaultPairDripFeesArgs,
    UpdatePythPriceFeed,
    DripV2InstructionNames,
    InitDripPositionArgs,
    InitGlobalConfigArgs,
    InitPairConfig,
    UpdateSuperAdmin,
    UpdateAdmin,
    UpdateDefaultDripFees,
    InitDripPositionNft,
    TokenizeDripPosition,
    DetokenizeDripPosition,
    ToggleAutoCredit,
    Deposit,
} from '@dcaf/drip-types/src/instructions';
import {
    MessageAccountKeys,
    MessageCompiledInstruction,
    PublicKey,
    VersionedTransactionResponse,
} from '@solana/web3.js';

import { programId } from './env';
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
} from './types';

const dripCoder: BorshCoder = new BorshCoder(IDL);

export function tryDecodeIx(
    tx: VersionedTransactionResponse,
    accountKeys: MessageAccountKeys,
    ix: MessageCompiledInstruction
): ParsedDripIx | undefined {
    const ixProgram = accountKeys.get(ix.programIdIndex);
    if (ixProgram?.toString() === programId.toString()) {
        try {
            return decodeIxToParsedDripIx(tx, ix);
        } catch (e) {
            if ((e as RestError).status >= 500) {
                throw e;
            }
            console.error(e);
        }
    }
    return undefined;
}

export function decodeIxToParsedDripIx(
    tx: VersionedTransactionResponse,
    ix: MessageCompiledInstruction
): ParsedDripIx {
    const decodedIx = dripCoder.instruction.decode(
        Buffer.from(ix.data),
        'base58'
    );
    if (!decodedIx) {
        throw RestError.internal(`failed to decode ix`);
    }
    const ixName = decodedIx.name as DripV2InstructionNames;
    const accounts = ix.accountKeyIndexes.map((accountIndx) => {
        const pubKey = tx.transaction.message.getAccountKeys().get(accountIndx);
        assert(
            pubKey,
            RestError.internal('unexpected missing account while processing ix')
        );
        return pubKey;
    });

    switch (ixName) {
        case 'initGlobalConfig':
            return parseInitGlobalConfig(decodedIx, accounts);
        case 'initPairConfig':
            return parseInitPairConfig(decodedIx, accounts);
        case 'updateSuperAdmin':
            return parseUpdateSuperAdmin(decodedIx, accounts);
        case 'updateAdmin':
            return parseUpdateAdmin(decodedIx, accounts);
        case 'updateDefaultDripFees':
            return parseUpdateDefaultDripFees(decodedIx, accounts);
        case 'updatePythPriceFeed':
            return parseUpdatePythPriceFeed(decodedIx, accounts);
        case 'updateDefaultPairDripFees':
            return parseUpdateDefaultPairDripFees(decodedIx, accounts);
        case 'initDripPosition':
            return parseInitDripPosition(decodedIx, accounts);
        case 'initDripPositionNft':
            return parseInitDripPositionNft(decodedIx, accounts);
        case 'tokenizeDripPosition':
            return parseTokenizeDripPosition(decodedIx, accounts);
        case 'detokenizeDripPosition':
            return parseDetokenizeDripPosition(decodedIx, accounts);
        case 'toggleAutoCredit':
            return parseToggleAutoCredit(decodedIx, accounts);
        case 'deposit':
            return parseDeposit(decodedIx, accounts);
        default:
            if (decodedIx.name in DripV2InstructionNames) {
                // TODO(mocha): update anchor-client-codegen so that this can be caught at compile time
                throw RestError.internal(`unhandled drip`);
            }
    }
    throw RestError.invalid(`invalid ix passed to tryDecodeToParsedDripIx`);
}

function parseDeposit(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedDeposit: ParsedDeposit } {
    const parsedIx = Deposit.fromDecoded(ixData.data as DepositArgs, accounts);
    return {
        parsedDeposit: {
            name: DripV2InstructionNames.deposit,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}

function parseToggleAutoCredit(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedToggleAutoCredit: ParsedToggleAutoCredit } {
    const parsedIx = ToggleAutoCredit.fromDecoded(accounts);
    return {
        parsedToggleAutoCredit: {
            name: DripV2InstructionNames.toggleAutoCredit,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseDetokenizeDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): {
    parsedDetokenizeDripPosition: Omit<ParsedDetokenizeDripPosition, 'index'>;
} {
    const parsedIx = DetokenizeDripPosition.fromDecoded(accounts);
    return {
        parsedDetokenizeDripPosition: {
            name: DripV2InstructionNames.detokenizeDripPosition,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseTokenizeDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedTokenizeDripPosition: Omit<ParsedTokenizeDripPosition, 'index'> } {
    const parsedIx = TokenizeDripPosition.fromDecoded(accounts);
    return {
        parsedTokenizeDripPosition: {
            name: DripV2InstructionNames.tokenizeDripPosition,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseInitDripPositionNft(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedInitDripPositionNft: ParsedInitDripPositionNft } {
    const parsedIx = InitDripPositionNft.fromDecoded(accounts);
    return {
        parsedInitDripPositionNft: {
            name: DripV2InstructionNames.initDripPositionNft,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseInitDripPosition(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedInitDripPosition: ParsedInitDripPosition } {
    const parsedIx = InitDripPosition.fromDecoded(
        ixData.data as InitDripPositionArgs,
        accounts
    );
    return {
        parsedInitDripPosition: {
            name: DripV2InstructionNames.initDripPosition,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}

function parseUpdateDefaultPairDripFees(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedUpdateDefaultPairDripFees: ParsedUpdateDefaultPairDripFees } {
    const parsedIx = UpdateDefaultPairDripFees.fromDecoded(
        ixData.data as UpdateDefaultPairDripFeesArgs,
        accounts
    );
    return {
        parsedUpdateDefaultPairDripFees: {
            name: DripV2InstructionNames.updateDefaultPairDripFees,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}

function parseUpdatePythPriceFeed(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedUpdatePythPriceFeed: ParsedUpdatePythPriceFeed } {
    const parsedIx = UpdatePythPriceFeed.fromDecoded(accounts);
    return {
        parsedUpdatePythPriceFeed: {
            name: DripV2InstructionNames.updatePythPriceFeed,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseUpdateDefaultDripFees(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedUpdateDefaultDripFees: ParsedUpdateDefaultDripFees } {
    const parsedIx = UpdateDefaultDripFees.fromDecoded(
        ixData.data as UpdateDefaultDripFeesArgs,
        accounts
    );
    return {
        parsedUpdateDefaultDripFees: {
            name: DripV2InstructionNames.updateDefaultDripFees,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}

function parseUpdateAdmin(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedUpdateAdmin: ParsedUpdateAdmin } {
    const parsedIx = UpdateAdmin.fromDecoded(
        ixData.data as UpdateAdminArgs,
        accounts
    );
    return {
        parsedUpdateAdmin: {
            name: DripV2InstructionNames.updateAdmin,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}

function parseUpdateSuperAdmin(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedUpdateSuperAdmin: ParsedUpdateSuperAdmin } {
    const parsedIx = UpdateSuperAdmin.fromDecoded(accounts);
    return {
        parsedUpdateSuperAdmin: {
            name: DripV2InstructionNames.updateSuperAdmin,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseInitPairConfig(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedInitPairConfig: ParsedInitPairConfig } {
    const parsedIx = InitPairConfig.fromDecoded(accounts);
    return {
        parsedInitPairConfig: {
            name: DripV2InstructionNames.initPairConfig,
            accounts: parsedIx.toAccountsJSON(),
        },
    };
}

function parseInitGlobalConfig(
    ixData: Instruction,
    accounts: PublicKey[]
): { parsedInitGlobalConfig: ParsedInitGlobalConfig } {
    const parsedIx = InitGlobalConfig.fromDecoded(
        ixData.data as InitGlobalConfigArgs,
        accounts
    );
    return {
        parsedInitGlobalConfig: {
            name: DripV2InstructionNames.initGlobalConfig,
            accounts: parsedIx.toAccountsJSON(),
            data: parsedIx.toArgsJSON(),
        },
    };
}
