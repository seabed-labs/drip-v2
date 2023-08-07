import { PublicKey } from '@solana/web3.js';

import { TxResult } from './TxResult';
import { DepositParams, WithdrawParams } from './params';

export interface PositionInProfit {
    pnl: 'profit';
    profitInInputTokens: bigint;
}

export interface PositionInLoss {
    pnl: 'loss';
    lossInInputTokens: bigint;
}

export interface PositionUnknownPnL {
    pnl: 'unknown';
    reason: 'no_price_data' | 'internal_error';
}

export type PositionPnL =
    | PositionInProfit
    | PositionInLoss
    | PositionUnknownPnL;

export type PositionStatus =
    | PositionCreated
    | PositionDripping
    | PositionPaused
    | PositionDripped;

export interface PositionCreated {
    status: 'created';
}

export interface PositionDripping {
    status: 'dripping';
    totalDeposits: bigint;
    totalInputDripped: bigint;
    totalOutputReceived: bigint;
    estimatedEndDate: Date;
    averageInputCostPerOutputToken: number;
    pnl: PositionPnL;
}

export interface PositionPaused {
    status: 'paused';
}

export interface PositionDripped {
    status: 'dripped';
    totalDeposits: bigint;
    totalOutputReceived: bigint;
    averageInputCostPerOutputToken: number;
}

export interface IDripPosition {
    pubkey: PublicKey;

    deposit(params: DepositParams): Promise<TxResult<null>>;
    withdraw(params: WithdrawParams): Promise<TxResult<null>>;
    close(): Promise<TxResult<null>>;

    getStatus(): Promise<PositionStatus>;
}
