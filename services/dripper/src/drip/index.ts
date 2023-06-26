import { Accounts } from '@dcaf/drip-types'
import { TransactionInstruction } from '@solana/web3.js'
import Provider from '@coral-xyz/anchor/dist/cjs/provider'

export type SwapQuote = {
    inputAmount: bigint
    outputAmount: bigint
}

export type SwapQuoteWithInstructions = SwapQuote & {
    instructions: TransactionInstruction[]
}

export interface IDripHandler {
    dripPosition(
        provider: Provider,
        position: Accounts.DripPosition
    ): Promise<string>
}

export interface ITokenSwapHandler {
    quote(position: Accounts.DripPosition): Promise<SwapQuoteWithInstructions>
}
