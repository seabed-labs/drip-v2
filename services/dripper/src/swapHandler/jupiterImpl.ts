import assert from 'assert';

import { PairConfigAccount } from '@dcaf/drip-types';
import { Jupiter, SwapMode } from '@jup-ag/core';
import { createTransferInstruction } from '@solana/spl-token-0-3-8';
import {
    Cluster,
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import JSBI from 'jsbi';
import { Logger } from 'winston';

import { DripPositionPendingDrip } from '../types';
import { maybeInitAta } from '../utils';

import { ISwapHandler, SwapQuoteWithInstructions } from './index';

export class JupiterSwap implements ISwapHandler {
    private jupiter: Jupiter | undefined;

    constructor(
        private readonly logger: Logger,
        private readonly cluster: Cluster,
        private readonly connection: Connection,
        private readonly dripper: PublicKey
    ) {
        this.jupiter = undefined;
    }

    async createSwapInstructions(
        dripPosition: DripPositionPendingDrip,
        pairConfig: PairConfigAccount
    ): Promise<SwapQuoteWithInstructions> {
        const [jup] = await Promise.all([this.initIfNeeded()]);
        const computeRoutesRes = await jup.computeRoutes({
            inputMint: new PublicKey(pairConfig.inputTokenMint),
            amount: JSBI.BigInt(dripPosition.dripAmountToFill.toString()),
            outputMint: new PublicKey(pairConfig.outputTokenMint),
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
            this.connection,
            this.dripper,
            pairConfig.outputTokenMint,
            this.dripper
        );
        instructions.push(
            createTransferInstruction(
                dripperOutputTokenAta,
                dripPosition.data.outputTokenAccount,
                this.dripper,
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
                connection: this.connection,
                cluster: this.cluster,
                user: this.dripper,
            });
        }
        return this.jupiter;
    }
}
