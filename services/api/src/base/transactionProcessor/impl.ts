import { VersionedTransaction } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';

import { ITransactionProcessor } from './types';

@injectable()
export class TransactionProcessor implements ITransactionProcessor {
    constructor(
        @inject(TYPES.IInstructionProcessor)
        private readonly instructionProcessor: ITransactionProcessor
    ) {}

    upsertDripTransaction(signature: string): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
