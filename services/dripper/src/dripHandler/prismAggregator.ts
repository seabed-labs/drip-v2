import assert from 'assert';

import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { DripV2 } from '@dcaf/drip-types';
import { Prism } from '@prism-hq/prism-ag';
import { Signer, Transaction } from '@solana/web3.js';
import Decimal from 'decimal.js';
import { Logger } from 'winston';

import { DripPosition } from '../positions';
import { DripperWallet } from '../wallet/impl';

import { PositionHandlerBase } from './abstract';

import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';

// Reverse engineered these types by logging their sdk

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

export class PrismSwap
    extends PositionHandlerBase
    implements ITokenSwapHandler
{
    constructor(
        baseLogger: Logger,
        dripperWallet: DripperWallet,
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: DripPosition
    ) {
        super(baseLogger, dripperWallet, provider, program, dripPosition);
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        const [prism, inputTokenAccount, pairConfigAccount] = await Promise.all(
            [
                Prism.init({
                    user: this.provider.publicKey,
                    connection: this.provider.connection,
                    // TODO(mocha): use slippage from position
                    slippage: 100,
                }),
                this.provider.connection.getTokenAccountBalance(
                    this.dripPosition.data.inputTokenAccount
                ),
                this.getPairConfig(),
            ]
        );
        await prism.loadRoutes(
            pairConfigAccount.inputTokenMint.toString(),
            pairConfigAccount.outputTokenMint.toString()
        );
        // Prism sdk uses UI values
        const [route] = prism.getRoutes(
            new Decimal(
                this.dripPosition.data.dripAmountRemainingPostFeesInCurrentCycle.toString()
            )
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
