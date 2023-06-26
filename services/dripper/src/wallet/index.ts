import { Wallet as AnchorWallet } from '@coral-xyz/anchor'
import { dripperKeypair } from '../env'

export class Wallet extends AnchorWallet {
    constructor() {
        super(dripperKeypair)
    }
}
