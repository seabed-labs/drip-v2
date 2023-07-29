import { AnchorProvider } from '@coral-xyz/anchor';
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
} from '@solana/spl-token-0-3-8';
import {
    AddressLookupTableProgram,
    Commitment,
    ConfirmOptions,
    Connection,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import { Logger } from 'winston';

import { createVersionedTransactions } from './solana';

const MAX_ACCOUNTS_PER_TX = 20;
const ACCOUNTS_PER_LUT = 256;
const APPROX_TIME_PER_SLOT_MS = 400;

export const DEFAULT_COMMITMENT: Commitment = 'confirmed';
export const MAX_TX_RETRY = 3;

export const DEFAULT_CONFIRM_OPTIONS: ConfirmOptions = {
    commitment: DEFAULT_COMMITMENT,
    maxRetries: MAX_TX_RETRY,
};

/**
 * Paginates an array using a callback
 * @param array - array to paginate over
 * @param fn - callback to process paginated items
 * @param pageSize - amount of items to pass to callback fn each page
 */
export async function paginate<T>(
    array: T[],
    fn: (items: T[], page: number) => Promise<void>,
    pageSize: number
) {
    let pageNumber = 0;
    for (;;) {
        const items = array.slice(
            pageNumber * pageSize,
            (pageNumber + 1) * pageSize
        );
        if (items.length === 0) {
            return;
        }
        await fn(items, pageNumber);
        pageNumber += 1;
    }
}

export function dedupeInstructionsPublicKeys(
    ixs: TransactionInstruction[]
): PublicKey[] {
    const pubKeyMap: Record<string, PublicKey> = {};
    ixs.forEach((ix) => {
        ix.keys.forEach((key) => {
            pubKeyMap[key.pubkey.toString()] = key.pubkey;
        });
    });
    return Object.values(pubKeyMap);
}

export function notEmpty<TValue>(
    value: TValue | null | undefined
): value is TValue {
    return value !== null && value !== undefined;
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO(#111): this likely exists somewhere, either in the SDK or spl-token
export async function maybeInitAta(
    connection: Connection,
    payer: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false
): Promise<{
    address: PublicKey;
    instruction?: TransactionInstruction;
}> {
    const ata = await getAssociatedTokenAddress(
        mint,
        owner,
        allowOwnerOffCurve
    );
    let ix: TransactionInstruction | undefined = undefined;
    if ((await connection.getAccountInfo(ata)) === null) {
        ix = createAssociatedTokenAccountInstruction(payer, ata, owner, mint);
    }
    return {
        address: ata,
        instruction: ix,
    };
}

// TODO(#114): this type of error handling likely exists already in a well formed and tested lib
export async function tryWithReturn<T>(
    logger: Logger,
    fn: () => Promise<T> | T,
    errorHandler?: (e: unknown) => Promise<T> | T
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (errorHandler) {
            return errorHandler(e);
        } else {
            logger.data({ error: JSON.stringify(e) }).error('unhandled error');
            throw e;
        }
    }
}

export async function createLut(
    provider: AnchorProvider,
    logger: Logger
): Promise<{
    lutAddress: PublicKey;
    txSig: string;
}> {
    const currentSlot = await provider.connection.getSlot(
        DEFAULT_CONFIRM_OPTIONS.commitment
    );
    const previousSlot = currentSlot - 1;
    const [lookupTableInst, lutAddress] =
        AddressLookupTableProgram.createLookupTable({
            authority: provider.publicKey,
            payer: provider.publicKey,
            recentSlot: previousSlot,
        });
    logger
        .data({ currentSlot, previousSlot, lutAddress })
        .info('created createLookUpTable ix');
    const [createLutTx] = await createVersionedTransactions(
        provider.connection,
        provider.publicKey,
        [[lookupTableInst]]
    );
    // lutAddresses.push(lookupTableAddress);
    const txSig = await provider.sendAndConfirm(
        createLutTx,
        [],
        DEFAULT_CONFIRM_OPTIONS
    );
    logger
        .data({ currentSlot, previousSlot, lutAddress, txSig })
        .info('created lut');
    return {
        lutAddress,
        txSig,
    };
}

export async function extendLut(
    provider: AnchorProvider,
    logger: Logger,
    lutAddress: PublicKey,
    accounts: PublicKey[]
): Promise<string> {
    logger
        .data({ lutAddress, accounts: accounts.length })
        .info('extending lut');
    const extendInstruction = AddressLookupTableProgram.extendLookupTable({
        payer: provider.publicKey,
        authority: provider.publicKey,
        lookupTable: lutAddress,
        addresses: accounts,
    });
    const [extendLutTx] = await createVersionedTransactions(
        provider.connection,
        provider.publicKey,
        [[extendInstruction]]
    );
    const txSig = await provider.sendAndConfirm(
        extendLutTx,
        [],
        DEFAULT_CONFIRM_OPTIONS
    );
    logger
        .data({ lutAddress, accounts: accounts.length, txSig })
        .info('extended lut');
    return txSig;
}

// TODO: Mocha, read up in depth on how lut activation/extensions work
export async function createLuts(
    provider: AnchorProvider,
    logger: Logger,
    allAccounts: PublicKey[]
): Promise<{
    lutAddresses: PublicKey[];
    txSigs: string[];
}> {
    logger
        .data({ lutAccountsLength: allAccounts.length })
        .info('creating luts');
    const lutAddresses: PublicKey[] = [];
    const txSigs: string[] = [];
    await paginate(
        allAccounts,
        async (lutAccounts, page: number) => {
            const { lutAddress, txSig: createLutTxSig } = await createLut(
                provider,
                logger.data({ lutNumber: page })
            );
            lutAddresses.push(lutAddress);
            txSigs.push(createLutTxSig);

            await paginate(
                lutAccounts,
                async (extendLutAccounts) => {
                    const extendLutTxSig = await extendLut(
                        provider,
                        logger,
                        lutAddress,
                        extendLutAccounts
                    );
                    txSigs.push(extendLutTxSig);
                },
                MAX_ACCOUNTS_PER_TX
            );
        },
        ACCOUNTS_PER_LUT
    );
    return {
        lutAddresses,
        txSigs,
    };
}

export async function getNextSlotWithRetry(
    connection: Connection,
    currentSlot: number,
    tryCount: number,
    maxTryLimit: number
): Promise<number> {
    if (tryCount >= maxTryLimit) {
        throw new Error(
            `TODO: couldn't find a slot greater than ${currentSlot} after ${maxTryLimit} tries`
        );
    }
    const slot = await connection.getSlot(DEFAULT_CONFIRM_OPTIONS.commitment);
    if (slot >= currentSlot + 1) {
        return slot;
    }
    await delay(APPROX_TIME_PER_SLOT_MS);
    return getNextSlotWithRetry(
        connection,
        currentSlot,
        tryCount + 1,
        maxTryLimit
    );
}
