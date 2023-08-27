import { DripPositionAccount, PairConfigAccount } from '@dcaf/drip-types';
import { Signer, TransactionInstruction } from '@solana/web3.js';

import { DripPositionPendingDrip } from '../types';

export type SwapQuote = {
    inputAmount: bigint;
    outputAmount: bigint;
    minOutputAmount: bigint;
};

export type SwapInstructions = {
    preSwapInstructions: TransactionInstruction[];
    preSigners: Signer[];
    swapInstructions: TransactionInstruction[];
    postSwapInstructions: TransactionInstruction[];
    postSigners: Signer[];
};

export type SwapQuoteWithInstructions = SwapQuote & SwapInstructions;

export type GetPositionHandler = (
    position: DripPositionAccount
) => ISwapHandler;

export interface ISwapHandler {
    createSwapInstructions(
        dripPositionPendingDrip: DripPositionPendingDrip,
        pairConfig: PairConfigAccount
    ): Promise<SwapQuoteWithInstructions>;
}
