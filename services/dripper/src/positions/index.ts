import { IDripHandler } from '../dripHandler'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection } from '../solana'
import { Position } from './onchain'
import { Accounts } from '@dcaf/drip-types'

export interface IPositionsFetcher {
    find(): Promise<Position[]>
}

export interface IPosition {
    get(): Accounts.DripPosition
    getDripHandler(
        provider: AnchorProvider,
        connection: Connection
    ): IDripHandler
}
