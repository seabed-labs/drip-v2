import { DripPositionAccount } from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

export type Common<A, B> = {
    [P in keyof A & keyof B]: A[P] | B[P];
};

// TODO: The code gen lib should create this type
// and return it in fetch and fetchNonNullable methods
export type DripPositionAccountWithAddress = {
    data: DripPositionAccount;
    address: PublicKey;
};

export type DripPositionPendingDrip = DripPositionAccountWithAddress & {
    dripAmountToFill: bigint;
};
