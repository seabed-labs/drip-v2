import { IDripHandler } from '../dripHandler'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection } from '../solana'
import { Accounts } from '@dcaf/drip-types'

export interface IPositionsFetcher {
    getPositionsPendingDrip(limit?: number): Promise<IPosition[]>
}

export interface IPosition {
    drip(): Promise<string>
}
