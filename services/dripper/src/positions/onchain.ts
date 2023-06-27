import { IPosition, IPositionsFetcher } from './index'
import { Accounts } from '@dcaf/drip-types'
import { IDripHandler } from '../dripHandler'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection } from '../solana'
import { MetaAggregator } from '../dripHandler/metaAggregator'
import { JupiterSwap } from '../dripHandler/jupiterAggregator'
import { PrismSwap } from '../dripHandler/prismAggregator'

export class OnChainPositionsFetcher implements IPositionsFetcher {
    find(): Promise<Position[]> {
        throw new Error('not implemented')
    }
}

export class Position implements IPosition {

    constructor(private readonly dripPosition: Accounts.DripPosition) {}

    getDripHandler(
        provider: AnchorProvider,
        connection: Connection
    ): IDripHandler {
        return new MetaAggregator(provider, connection, this.dripPosition, [
            new JupiterSwap(
                provider,
                connection,
                this.dripPosition,
                'mainnet-beta'
            ),
            new PrismSwap(provider, connection, this.dripPosition),
        ])
    }

    get(): Accounts.DripPosition {
        return this.dripPosition;
    }
}
