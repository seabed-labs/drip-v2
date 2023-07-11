import {
    Commitment,
    ConfirmOptions,
    Connection,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
} from '@solana/spl-token-0-3-8';

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

// TODO(#112): These should live in the SDK
export function deriveGlobalConfigSigner(
    globalConfig: PublicKey,
    dripProgramId: PublicKey
): PublicKey {
    const [globalConfigSigner] = PublicKey.findProgramAddressSync(
        [Buffer.from('drip-v2-global-signer'), globalConfig.toBuffer()],
        dripProgramId
    );
    return globalConfigSigner;
}

// TODO(#112): These should live in the SDK
export function derivePositionSigner(
    dripPosition: PublicKey,
    dripProgramId: PublicKey
): PublicKey {
    const [dripPositionSigner] = PublicKey.findProgramAddressSync(
        [Buffer.from('drip-v2-drip-position-signer'), dripPosition.toBuffer()],
        dripProgramId
    );
    return dripPositionSigner;
}

// TODO(#114): this type of error handling likely exists already in a well formed and tested lib
export async function tryWithReturn<T>(
    fn: () => Promise<T> | T,
    errorHandler?: (e: unknown) => Promise<T> | T
): Promise<T> {
    try {
        return await fn();
    } catch (e) {
        if (errorHandler) {
            return errorHandler(e);
        } else {
            console.log(JSON.stringify(e, null, 2));
            throw e;
        }
    }
}
