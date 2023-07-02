import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';
import { Accounts, DripV2 } from '@dcaf/drip-types';
import { PublicKey, Signer, Transaction } from '@solana/web3.js';
import assert from 'assert';
import { PositionHandlerBase } from './abstract';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Prism } from '@prism-hq/prism-ag';
import Decimal from 'decimal.js';

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
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: Accounts.DripPosition,
        dripPositionPublicKey: PublicKey
    ) {
        super(provider, program, dripPosition, dripPositionPublicKey);
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        return this.quote();
    }

    async quote(): Promise<SwapQuoteWithInstructions> {
        const [prism, inputToken] = await Promise.all([
            Prism.init({
                user: this.provider.publicKey,
                connection: this.provider.connection,
                // TODO(mocha): use slippage from position
                slippage: 100,
            }),
            this.provider.connection.getTokenAccountBalance(
                this.dripPosition.inputTokenAccount
            ),
        ]);
        await prism.loadRoutes(
            this.dripPosition.inputTokenMint.toString(),
            this.dripPosition.outputTokenMint.toString()
        );
        // Prism sdk uses UI values
        const [route] = prism.getRoutes(
            new Decimal(this.dripPosition.dripAmount.toString())
                .div(Math.pow(10, inputToken.value.decimals))
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
