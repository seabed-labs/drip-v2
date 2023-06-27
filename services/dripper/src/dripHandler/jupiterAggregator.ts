import {
    DripInstructions,
    ITokenSwapHandler,
    SwapQuoteWithInstructions,
} from './index'
import { Accounts } from '@dcaf/drip-types'
import { Jupiter, SwapMode } from '@jup-ag/core'
import {
    Cluster,
    Connection,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'
import JSBI from 'jsbi'
import assert from 'assert'
import { PositionHandlerBase } from './abstract'
import { AnchorProvider } from '@coral-xyz/anchor'

export class JupiterSwap
    extends PositionHandlerBase
    implements ITokenSwapHandler
{
    private jupiter: Jupiter | undefined

    constructor(
        provider: AnchorProvider,
        connection: Connection,
        dripPosition: Accounts.DripPosition,
        private readonly cluster: Cluster
    ) {
        super(provider, connection, dripPosition)
        this.jupiter = undefined
    }

    async createSwapInstructions(): Promise<DripInstructions> {
        return this.quote()
    }

    async quote(): Promise<SwapQuoteWithInstructions> {
        const jup = await this.initIfNeeded()
        const computeRoutesRes = await jup.computeRoutes({
            inputMint: new PublicKey(this.dripPosition.inputTokenMint),
            amount: JSBI.BigInt(this.dripPosition.dripAmount.toString()),
            outputMint: new PublicKey(this.dripPosition.outputTokenMint),
            // TODO: use position defined position slippage
            slippageBps: 100,
            forceFetch: true,
            swapMode: SwapMode.ExactIn,
            filterTopNResult: 1,
        })
        // TODO: defined errors
        assert(
            computeRoutesRes.routesInfos,
            new Error('no routes for jupiter swap')
        )
        const [route] = computeRoutesRes.routesInfos

        const { swapTransaction, addressLookupTableAccounts } =
            await jup.exchange({
                routeInfo: route,
                asLegacyTransaction: false,
            })
        const message = TransactionMessage.decompile(
            (swapTransaction as VersionedTransaction).message,
            {
                addressLookupTableAccounts: addressLookupTableAccounts,
            }
        )
        return {
            inputAmount: BigInt(route.inAmount.toString()),
            outputAmount: BigInt(route.outAmount.toString()),
            preSwapInstructions: [],
            preSigners: [],
            swapInstructions: message.instructions,
            postSwapInstructions: [],
            postSigners: [],
        }
    }

    private async initIfNeeded(): Promise<Jupiter> {
        if (!this.jupiter) {
            this.jupiter = await Jupiter.load({
                connection: this.connection,
                cluster: this.cluster,
                user: this.provider.publicKey,
            })
        }
        return this.jupiter
    }
}
