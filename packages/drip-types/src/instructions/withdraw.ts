import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface WithdrawArgs {
    params: types.WithdrawParamsFields
}

export interface WithdrawAccounts {
    signer: PublicKey
    destinationInputTokenAccount: PublicKey
    destinationOutputTokenAccount: PublicKey
    dripPositionInputTokenAccount: PublicKey
    dripPositionOutputTokenAccount: PublicKey
    dripPositionNftMint: PublicKey
    dripPositionNftAccount: PublicKey
    dripPosition: PublicKey
    dripPositionSigner: PublicKey
    tokenProgram: PublicKey
}

export const layout = borsh.struct([types.WithdrawParams.layout('params')])

export function withdraw(
    args: WithdrawArgs,
    accounts: WithdrawAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        {
            pubkey: accounts.destinationInputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.destinationOutputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionInputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionOutputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionNftMint,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: accounts.dripPositionNftAccount,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.dripPosition, isSigner: false, isWritable: false },
        {
            pubkey: accounts.dripPositionSigner,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ]
    const identifier = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34])
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
        {
            params: types.WithdrawParams.toEncodable(args.params),
        },
        buffer
    )
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
