import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { IInstructionProcessor } from '../InstructionProcessor';
import { IConnection } from '../rpcConnection';

import { ITransactionProcessor } from './types';

@injectable()
export class TransactionProcessor implements ITransactionProcessor {
    constructor(
        @inject(TYPES.IConnection) private readonly Connection: IConnection,
        @inject(TYPES.IInstructionProcessor)
        private readonly instructionProcessor: IInstructionProcessor
    ) {}

    async upsertDripTransaction(signature: string): Promise<void> {
        const tx = await this.Connection.getTransaction(signature, {
            maxSupportedTransactionVersion: 0,
        });
        if (!tx) {
            return;
        }
        const numIxs = tx.transaction.message.compiledInstructions.length || 0;
        const accountKeys = tx.transaction.message.getAccountKeys();
        for (let i = 0; i < numIxs; i++) {
            const ix = tx.transaction.message.compiledInstructions[i];
            await this.instructionProcessor.upsertInstruction(
                tx,
                accountKeys,
                ix
            );
        }
        return;
    }
}
