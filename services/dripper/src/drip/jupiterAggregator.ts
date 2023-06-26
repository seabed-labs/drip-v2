import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index'
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

export class JupiterSwap implements ITokenSwapHandler {
    private jupiter: Jupiter | undefined

    constructor(
        private readonly connection: Connection,
        private readonly cluster: Cluster,
        private readonly dripperPub: PublicKey
    ) {
        this.jupiter = undefined
    }

    async quote(
        position: Accounts.DripPosition
    ): Promise<SwapQuoteWithInstructions> {
        const jup = await this.initIfNeeded()
        const computeRoutesRes = await jup.computeRoutes({
            inputMint: new PublicKey(position.inputTokenMint),
            amount: JSBI.BigInt(position.dripAmount.toString()),
            outputMint: new PublicKey(position.outputTokenMint),
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
            instructions: message.instructions,
        }
    }

    private async initIfNeeded(): Promise<Jupiter> {
        if (!this.jupiter) {
            this.jupiter = await Jupiter.load({
                connection: this.connection,
                cluster: this.cluster,
                // TODO(mocha): Dripper pubkey
                user: this.dripperPub,
            })
        }
        return this.jupiter
    }
}
