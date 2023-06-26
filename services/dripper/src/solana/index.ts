import { Connection as Web3Conn } from '@solana/web3.js'
import { rpcUrl } from '../env'
import { DEFAULT_COMMITMENT } from '../utils'

export class Connection extends Web3Conn {
    constructor() {
        super(rpcUrl, DEFAULT_COMMITMENT)
    }
}
