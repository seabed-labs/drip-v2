import { Accounts, DripV2 } from '@dcaf/drip-types';
import { PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { MetaAggregator } from './metaAggregator';
import { JupiterSwap } from './jupiterAggregator';

export type SwapQuote = {
    inputAmount: bigint;
    outputAmount: bigint;
    minOutputAmount: bigint;
};

export type SwapQuoteWithInstructions = SwapQuote & SwapInstructions;

export type SwapInstructions = {
    preSwapInstructions: TransactionInstruction[];
    preSigners: Signer[];
    swapInstructions: TransactionInstruction[];
    postSwapInstructions: TransactionInstruction[];
    postSigners: Signer[];
};

export interface IDripHandler {
    drip(): Promise<string>;
}

export interface ITokenSwapHandler {
    quote(position: Accounts.DripPosition): Promise<SwapQuoteWithInstructions>;
}

export type GetPositionHandler = (
    position: Accounts.DripPosition,
    positionPublicKey: PublicKey
) => Promise<IDripHandler>;

export function getPositionHandler(
    provider: AnchorProvider,
    program: Program<DripV2>
): GetPositionHandler {
    return async (
        dripPosition: Accounts.DripPosition,
        dripPositionPublicKey: PublicKey
    ): Promise<IDripHandler> => {
        const jupiterSwap = new JupiterSwap(
            provider,
            program,
            dripPosition,
            dripPositionPublicKey,
            'mainnet-beta'
        );
        // const prismSwap = new PrismSwap(
        //     provider,
        //     program,
        //     dripPosition,
        //     dripPositionPublicKey
        // );
        const metaAggregator = new MetaAggregator(
            provider,
            program,
            dripPosition,
            dripPositionPublicKey,
            [jupiterSwap]
        );
        // TODO: return handler based on position and config
        return metaAggregator;
    };
}
