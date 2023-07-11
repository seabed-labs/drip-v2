import { DripV2 } from '@dcaf/drip-types';
import { Signer, TransactionInstruction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { MetaAggregator } from './metaAggregator';
import { JupiterSwap } from './jupiterAggregator';
import { DripPosition } from '../positions';

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
    createSwapInstructions(
        position: DripPosition
    ): Promise<SwapQuoteWithInstructions>;
}

export type GetPositionHandler = (
    position: DripPosition
) => Promise<IDripHandler>;

export function getPositionHandler(
    provider: AnchorProvider,
    program: Program<DripV2>
): GetPositionHandler {
    return async (dripPosition: DripPosition): Promise<IDripHandler> => {
        const jupiterSwap = new JupiterSwap(
            provider,
            program,
            dripPosition,
            'mainnet-beta'
        );
        // const prismSwap = new PrismSwap(
        //     provider,
        //     program,
        //     dripPosition,
        // );
        const metaAggregator = new MetaAggregator(
            provider,
            program,
            dripPosition,
            [jupiterSwap]
        );
        // TODO: return handler based on position and config
        return metaAggregator;
    };
}

export function compareSwapQuoteDesc(a: SwapQuote, b: SwapQuote): number {
    const aQuoute = a.minOutputAmount / a.inputAmount;
    const bQuoute = b.minOutputAmount / b.inputAmount;
    if (aQuoute > bQuoute) {
        // sort a before b, e.g. [a, b]
        return -1;
    } else if (aQuoute < bQuoute) {
        // sort a after b, e.g. [b, a]
        return 1;
    }
    return 0;
}
