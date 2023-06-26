// import {Address} from "@coral-xyz/anchor";
import { Accounts } from '@dcaf/drip-types'
import { IDripHandler } from '../dripHandler'

export interface IPositionsFetcher {
    find(): Promise<Accounts.DripPosition[]>
    getDripHandler(position: Accounts.DripPosition): IDripHandler
}
