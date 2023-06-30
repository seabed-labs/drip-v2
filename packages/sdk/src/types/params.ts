import { PublicKey, Signer } from '@solana/web3.js';

export interface CreatePositionParams {
    owner: PublicKey;
    payer?: PublicKey;
    inputMint: PublicKey;
    outputMint: PublicKey;
    dripAmount: bigint;
    dripFrequencyInSeconds: number;
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
