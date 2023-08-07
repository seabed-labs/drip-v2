import { Connection, Transaction } from '@solana/web3.js';

export async function newTransaction(
    connection: Connection
): Promise<Transaction> {
    return new Transaction(await connection.getLatestBlockhash('finalized'));
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
