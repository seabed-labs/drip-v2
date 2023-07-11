import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';
import { DripV2 } from '@dcaf/drip-types';
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
import { createTransferInstruction } from '@solana/spl-token-0-3-8';
import { maybeInitAta } from '../utils';
import { DripPosition } from '../positions';

export class JupiterSwap
    extends PositionHandlerBase
    implements ITokenSwapHandler
{
    private jupiter: Jupiter | undefined;

    constructor(
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: DripPosition,
        private readonly cluster: Cluster
    ) {
        super(provider, program, dripPosition);
        this.jupiter = undefined;
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        const jup = await this.initIfNeeded();
        const computeRoutesRes = await jup.computeRoutes({
            inputMint: new PublicKey(this.dripPosition.data.inputTokenMint),
            amount: JSBI.BigInt(this.dripPosition.data.dripAmount.toString()),
            outputMint: new PublicKey(this.dripPosition.data.outputTokenMint),
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
        const { address: dripperOutputTokenAta } = await maybeInitAta(
            this.provider.connection,
            this.program.programId,
            this.dripPosition.data.outputTokenMint,
            this.provider.publicKey
        );
        instructions.push(
            createTransferInstruction(
                dripperOutputTokenAta,
                this.dripPosition.data.outputTokenAccount,
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
