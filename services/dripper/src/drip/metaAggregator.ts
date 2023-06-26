import { DripHandlerBase } from './abstract'
import { IDripHandler, ITokenSwapHandler } from './index'
import { Accounts } from '@dcaf/drip-types'
import { Connection, TransactionInstruction } from '@solana/web3.js'
import assert from 'assert'
import { AnchorProvider } from '@coral-xyz/anchor'

// todo: move this
function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined
}

export class MetaAggregator extends DripHandlerBase implements IDripHandler {
    constructor(
        provider: AnchorProvider,
        connection: Connection,
        private readonly swaps: ITokenSwapHandler[]
    ) {
        super(provider, connection)
    }
    async createDripInstructions(
        position: Accounts.DripPosition
    ): Promise<TransactionInstruction[]> {
        const instructions: TransactionInstruction[] = []
        if (await this.shouldInitPairConfig(position)) {
            instructions.push(...(await this.getInitPairConfigIx(position)))
        }

        const quotesWithIxs = (
            await Promise.all(
                this.swaps.map((swapImpl) => {
                    try {
                        return swapImpl.quote(position)
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

        const quoteWithIxs = quotesWithIxs[0]

        // TODO: pre drip
        instructions.push(...quoteWithIxs.instructions)
        // TODO: post drip

        return instructions
    }
}
