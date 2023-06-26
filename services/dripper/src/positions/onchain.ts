import { IPositionsFetcher } from './index'
import { Accounts } from '@dcaf/drip-types'
import { IDripHandler } from '../dripHandler'

export class OnChainPositionsFetcher implements IPositionsFetcher {
    find(): Promise<Accounts.DripPosition[]> {
        throw new Error('not implemented')
    }

    getDripHandler(position: Accounts.DripPosition): IDripHandler {
        throw new Error('not implemented')
    }
}
