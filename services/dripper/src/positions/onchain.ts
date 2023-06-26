import { IPositions } from './index'
import { Accounts } from '@dcaf/drip-types'
import { IDripHandler } from '../drip'

export class OnChainPositionsFetcher implements IPositions {
    find(): Promise<Accounts.DripPosition[]> {
        throw new Error('not implemented')
    }

    getDripHandler(position: Accounts.DripPosition): IDripHandler {
        throw new Error('not implemented')
    }
}
