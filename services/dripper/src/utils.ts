import { Commitment, ConfirmOptions } from '@solana/web3.js'

export const DEFAULT_COMMITMENT: Commitment = 'confirmed'
export const MAX_TX_RETRY = 3

export const DEFAULT_CONFIRM_OPTIONS: ConfirmOptions = {
    commitment: DEFAULT_COMMITMENT,
    maxRetries: MAX_TX_RETRY,
}

/**
 * Paginates an array using a callback
 * @param array - array to paginate over
 * @param fn - callback to process paginated items
 * @param pageSize - amount of items to pass to callback fn each page
 */
export async function paginate<T>(
    array: T[],
    fn: (items: T[]) => Promise<void>,
    pageSize: number
) {
    let pageNumber = 0
    for (;;) {
        const items = array.slice(
            pageNumber * pageSize,
            (pageNumber + 1) * pageSize
        )
        if (items.length === 0) {
            return
        }
        await fn(items)
        pageNumber += 1
    }
}
