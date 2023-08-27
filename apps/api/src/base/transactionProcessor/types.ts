export interface ITransactionProcessor {
    upsertDripTransaction(signature: string): Promise<void>;
}
