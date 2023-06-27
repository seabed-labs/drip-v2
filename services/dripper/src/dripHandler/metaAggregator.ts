import { PositionHandlerBase } from './abstract'
import { DripInstructions, ITokenSwapHandler } from './index'
import { Accounts } from '@dcaf/drip-types'
import { Connection } from '@solana/web3.js'
import assert from 'assert'
import { AnchorProvider } from '@coral-xyz/anchor'
import { notEmpty } from '../utils'

export class MetaAggregator extends PositionHandlerBase {
    constructor(
        provider: AnchorProvider,
        connection: Connection,
        dripPosition: Accounts.DripPosition,
        private readonly swaps: ITokenSwapHandler[]
    ) {
        super(provider, connection, dripPosition)
    }

    async createSwapInstructions(): Promise<DripInstructions> {
        const quotesWithIxs = (
            await Promise.all(
                this.swaps.map((swapImpl) => {
                    try {
                        return swapImpl.quote(this.dripPosition)
                    } catch (e) {
                        // todo: log unknown errors
                        console.error(e)
                        return undefined
                    }
                })
            )
        ).filter(notEmpty)

        // TODO(mocha): define error
        assert(
            quotesWithIxs.length,
            new Error('no valid quotes for meta aggregator')
        )

        // TODO(mocha): impl sort
        quotesWithIxs.sort((a, b): number => {
            return 0
        })
        const [quoteWithIxs] = quotesWithIxs
        return quoteWithIxs
    }
}
