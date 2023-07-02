import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';
import { Accounts, DripV2 } from '@dcaf/drip-types';
import { Jupiter, SwapMode } from '@jup-ag/core';
import {
    Cluster,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import JSBI from 'jsbi';
import assert from 'assert';
import { PositionHandlerBase } from './abstract';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {createCloseAccountInstruction, createTransferInstruction, NATIVE_MINT} from '@solana/spl-token-0-3-8';

export class JupiterSwap
    extends PositionHandlerBase
    implements ITokenSwapHandler
{
    private jupiter: Jupiter | undefined;

    constructor(
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: Accounts.DripPosition,
        dripPositionPublicKey: PublicKey,
        private readonly cluster: Cluster
    ) {
        super(provider, program, dripPosition, dripPositionPublicKey);
        this.jupiter = undefined;
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        return this.quote();
    }

    // TODO: Not sure we need this fn anymore
    async quote(): Promise<SwapQuoteWithInstructions> {
        const jup = await this.initIfNeeded();
        const computeRoutesRes = await jup.computeRoutes({
            inputMint: new PublicKey(this.dripPosition.inputTokenMint),
            amount: JSBI.BigInt(this.dripPosition.dripAmount.toString()),
            outputMint: new PublicKey(this.dripPosition.outputTokenMint),
            // TODO: use position defined position slippage
            slippageBps: 100,
            forceFetch: true,
            swapMode: SwapMode.ExactIn,
            filterTopNResult: 1,
        });
        // TODO: defined errors
        assert(
            computeRoutesRes.routesInfos,
            new Error('no routes for jupiter swap')
        );
        const [route] = computeRoutesRes.routesInfos;

        const { swapTransaction, addressLookupTableAccounts } =
            await jup.exchange({
                routeInfo: route,
                wrapUnwrapSOL: false,
                asLegacyTransaction: false,
            });
        const message = TransactionMessage.decompile(
            (swapTransaction as VersionedTransaction).message,
            {
                addressLookupTableAccounts: addressLookupTableAccounts,
            }
        );
        const instructions = message.instructions;
        const { address: dripperOutputTokenAta } = await this.maybeInitAta(
            this.dripPosition.outputTokenMint,
            this.provider.publicKey
        );
        // TODO: wont need this after
        // instructions.push(
        //     createCloseAccountInstruction(
        //         dripperOutputTokenAta,
        //         this.dripPosition.outputTokenAccount,
        //         this.provider.publicKey
        //     )
        // );
        instructions.push(
            createTransferInstruction(
                dripperOutputTokenAta,
                this.dripPosition.outputTokenAccount,
                this.provider.publicKey,
                BigInt(route.otherAmountThreshold.toString())
            )
        );
        return {
            inputAmount: BigInt(route.inAmount.toString()),
            // min output because we specify exactIn above
            minOutputAmount: BigInt(route.otherAmountThreshold.toString()),
            outputAmount: BigInt(route.outAmount.toString()),
            preSwapInstructions: [],
            preSigners: [],
            swapInstructions: instructions,
            postSwapInstructions: [],
            postSigners: [],
        };
    }

    private async initIfNeeded(): Promise<Jupiter> {
        if (!this.jupiter) {
            this.jupiter = await Jupiter.load({
                connection: this.provider.connection,
                cluster: this.cluster,
                user: this.provider.publicKey,
            });
        }
        return this.jupiter;
    }
}
