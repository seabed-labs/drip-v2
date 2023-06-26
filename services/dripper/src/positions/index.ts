// import {Address} from "@coral-xyz/anchor";
import { Accounts } from '@dcaf/drip-types'
import { IDripHandler } from '../drip'

export interface IPositionsFetcher {
    find(): Promise<Accounts.DripPosition[]>
    getDripHandler(position: Accounts.DripPosition): IDripHandler
}
