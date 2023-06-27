import {
    AddressLookupTableAccount,
    Connection as Web3Conn,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'
import { rpcUrl } from '../env'
import { DEFAULT_COMMITMENT } from '../utils'

export class Connection extends Web3Conn {
    constructor() {
        super(rpcUrl, DEFAULT_COMMITMENT)
    }
}

export async function createVersionedTransactions(
    connection: Connection,
    payerKey: PublicKey,
    instructionsForTxs: TransactionInstruction[][],
    addressLookupTableAccounts?: AddressLookupTableAccount[]
): Promise<VersionedTransaction[]> {
    const recentBlockhash = await connection
        .getLatestBlockhash()
        .then((lb) => lb.blockhash)
    return instructionsForTxs.map((instructions) => {
        const messageV0 = new TransactionMessage({
            payerKey,
            recentBlockhash,
            instructions,
        }).compileToV0Message(addressLookupTableAccounts)
        return new VersionedTransaction(messageV0)
    })
}
