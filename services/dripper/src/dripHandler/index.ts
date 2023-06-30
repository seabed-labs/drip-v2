import { Accounts } from '@dcaf/drip-types';
import { Connection, Signer, TransactionInstruction } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { MetaAggregator } from './metaAggregator';
import { JupiterSwap } from './jupiterAggregator';
import { PrismSwap } from './prismAggregator';

export type SwapQuote = {
    inputAmount: bigint;
    outputAmount: bigint;
};

export type SwapQuoteWithInstructions = SwapQuote & DripInstructions;

export type DripInstructions = {
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
    position: Accounts.DripPosition
) => Promise<IDripHandler>;

export function getPositionHandler(
    provider: AnchorProvider,
    connection: Connection
): GetPositionHandler {
    return async (
        dripPosition: Accounts.DripPosition
    ): Promise<IDripHandler> => {
        const jupiterSwap = new JupiterSwap(
            provider,
            connection,
            dripPosition,
            'mainnet-beta'
        );
        const prismSwap = new PrismSwap(provider, connection, dripPosition);
        const metaAggregator = new MetaAggregator(
            provider,
            connection,
            dripPosition,
            [jupiterSwap, prismSwap]
        );
        // TODO: return handler based on position and config
        return metaAggregator;
    };
}
