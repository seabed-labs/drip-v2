import {
    AddressLookupTableAccount,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
    Connection as Web3Conn,
} from '@solana/web3.js';

import { DEFAULT_COMMITMENT, DEFAULT_CONFIRM_OPTIONS } from '../utils';

export class Connection extends Web3Conn {
    constructor(rpcUrl: string) {
        super(rpcUrl, DEFAULT_COMMITMENT);
    }
}

export async function createVersionedTransactions(
    connection: Connection,
    payerKey: PublicKey,
    instructionsForTxs: TransactionInstruction[][],
    addressLookupTableAccounts?: AddressLookupTableAccount[]
): Promise<VersionedTransaction[]> {
    const recentBlockhash = await connection
        .getLatestBlockhash(DEFAULT_CONFIRM_OPTIONS.commitment)
        .then((lb) => lb.blockhash);
    return instructionsForTxs.map((instructions) => {
        const messageV0 = new TransactionMessage({
            payerKey,
            recentBlockhash,
            instructions,
        }).compileToV0Message(addressLookupTableAccounts);
        return new VersionedTransaction(messageV0);
    });
}
