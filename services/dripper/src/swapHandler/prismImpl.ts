import assert from 'assert';

import { PairConfigAccount } from '@dcaf/drip-types';
import { Prism } from '@prism-hq/prism-ag';
import { Connection, PublicKey, Signer, Transaction } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Logger } from 'winston';

import { DripPositionPendingDrip } from '../types';

import { ISwapHandler, SwapQuoteWithInstructions } from './index';

// These types are reverse engineered by logging their sdk

type PrismSwapTransactions = {
    preTransaction: Transaction;
    mainTransaction: Transaction;
    postTransaction: Transaction;
    preSigners: Signer[];
};

type PrismRoute = {
    // all ui units
    amountIn: number;
    amountOut: number;
    amountWithFees: number;
    minimumReceived: number;
    priceImpact: number;
    routeData: {
        fromCoin: {
            symbol: string;
            decimals: number;
            mintAddress: string;
        };
        toCoin: {
            symbol: string;
            decimals: number;
            mintAddress: string;
        };
    };
};

export class PrismSwap implements ISwapHandler {
    constructor(
        private readonly logger: Logger,
        private readonly connection: Connection,
        private readonly dripper: PublicKey
    ) {}

    async createSwapInstructions(
        dripPosition: DripPositionPendingDrip,
        pairConfig: PairConfigAccount
    ): Promise<SwapQuoteWithInstructions> {
        const [prism, inputTokenAccount] = await Promise.all([
            Prism.init({
                user: this.dripper,
                connection: this.connection,
                // Can't cache this like we do with jupiter because there is no way to
                // specify the slippage when fetching routes
                // although there is setSlippage, if this class is re-used across multiple positions
                // slippage from one position can leak into another
                // TODO(mocha): use slippage from position
                slippage: 100,
            }),
            this.connection.getTokenAccountBalance(
                dripPosition.data.inputTokenAccount
            ),
        ]);
        await prism.loadRoutes(
            pairConfig.inputTokenMint.toString(),
            pairConfig.outputTokenMint.toString()
        );
        // Prism sdk uses UI values
        const [route] = prism.getRoutes(
            new Decimal(dripPosition.dripAmountToFill.toString())
                .div(Math.pow(10, inputTokenAccount.value.decimals))
                .toNumber()
        ) as PrismRoute[];

        assert(route, new Error('TODO'));
        const swapTxRes = (await prism.generateSwapTransactions(
            route,
            false
        )) as PrismSwapTransactions;

        return {
            inputAmount: BigInt(
                route.amountIn * Math.pow(10, route.routeData.fromCoin.decimals)
            ),
            outputAmount: BigInt(
                route.amountWithFees *
                    Math.pow(10, route.routeData.toCoin.decimals)
            ),
            minOutputAmount: BigInt(
                route.minimumReceived *
                    Math.pow(10, route.routeData.toCoin.decimals)
            ),
            preSwapInstructions: swapTxRes.preTransaction.instructions,
            preSigners: swapTxRes.preSigners,
            swapInstructions: swapTxRes.mainTransaction.instructions,
            postSwapInstructions: swapTxRes.postTransaction.instructions,
            postSigners: [],
        };
    }
}
