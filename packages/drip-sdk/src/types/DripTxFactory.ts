import {
    Keypair,
    Signer,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import { CreatePositionParams, DepositParams, WithdrawParams } from './params';

export interface DripInstructions {
    instructions: TransactionInstruction[];
    signers: Signer[];
}

export interface IDripInstructionsFactory {
    getCreatePositionTransaction(
        params: Omit<CreatePositionParams, 'signers'>,
        dripPositionKeypair?: Keypair
    ): Promise<DripInstructions>;
    getDepositTransaction(params: DepositParams): Promise<Transaction>;
    getWithdrawTransaction(params: WithdrawParams): Promise<Transaction>;
    getClosePositionTransaction(): Promise<Transaction>;
}
