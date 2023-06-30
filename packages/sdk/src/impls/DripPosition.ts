import { PublicKey } from '@solana/web3.js';
import {
    DepositParams,
    IDripPosition,
    PositionStatus,
    TxResult,
    WithdrawParams,
} from '../types';

export class DripPosition implements IDripPosition {
    constructor(public readonly pubkey: PublicKey) {}

    deposit(params: DepositParams): Promise<TxResult<null>> {
        throw new Error('Method not implemented.');
    }
    withdraw(params: WithdrawParams): Promise<TxResult<null>> {
        throw new Error('Method not implemented.');
    }
    close(): Promise<TxResult<null>> {
        throw new Error('Method not implemented.');
    }
    getStatus(): Promise<PositionStatus> {
        throw new Error('Method not implemented.');
    }
}
