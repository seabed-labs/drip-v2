import { Accounts } from '@dcaf/drip-types'
import { Signer, TransactionInstruction } from '@solana/web3.js'

export type SwapQuote = {
    inputAmount: bigint
    outputAmount: bigint
}

export type SwapQuoteWithInstructions = SwapQuote & DripInstructions

export type DripInstructions = {
    preSwapInstructions: TransactionInstruction[]
    preSigners: Signer[]
    swapInstructions: TransactionInstruction[]
    postSwapInstructions: TransactionInstruction[]
    postSigners: Signer[]
}

export interface IDripHandler {
    drip(): Promise<string>
}

export interface ITokenSwapHandler {
    quote(position: Accounts.DripPosition): Promise<SwapQuoteWithInstructions>
}
