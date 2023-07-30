import { InitDripPositionParamsFields } from '@dcaf/drip-types';
import { PublicKey, Signer } from '@solana/web3.js';

export interface CreatePositionParams extends InitDripPositionParamsFields {
    payer?: PublicKey;
    inputMint: PublicKey;
    outputMint: PublicKey;
    initialDeposit?: {
        amount: bigint;
        depositor: PublicKey;
        depositorTokenAccount: PublicKey;
    };
    signers?: Signer[];
    // TODO: Support tokenizing + enabling auto-credit here
}

export interface DepositParams {
    amount: bigint;
}

export interface WithdrawParams {
    inputTokenAmount: bigint;
    outputTokenAmount: bigint;
}
