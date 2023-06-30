import { Transaction } from '@solana/web3.js';
import { CreatePositionParams, DepositParams, WithdrawParams } from './params';

export interface IDripTxFactory {
    getCreatePositionTransaction(
        params?: CreatePositionParams
    ): Promise<Transaction>;
    getDepositTransaction(params: DepositParams): Promise<Transaction>;
    getWithdrawTransaction(params: WithdrawParams): Promise<Transaction>;
    getClosePositionTransaction(): Promise<Transaction>;
}
