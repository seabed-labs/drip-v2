import { Transaction } from '@solana/web3.js';
import {
    CreatePositionParams,
    DepositParams,
    IDripTxFactory,
    WithdrawParams,
} from '../types';

export class DripTxFactory implements IDripTxFactory {
    getCreatePositionTransaction(
        params?: CreatePositionParams | undefined
    ): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getDepositTransaction(params: DepositParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getWithdrawTransaction(params: WithdrawParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getClosePositionTransaction(): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
}
