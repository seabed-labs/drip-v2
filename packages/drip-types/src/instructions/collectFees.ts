import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface CollectFeesArgs {
    params: types.CollectFeesParamsFields
}

export interface CollectFeesAccounts {
    signer: PublicKey
    globalConfig: PublicKey
    globalConfigSigner: PublicKey
    feeTokenAccount: PublicKey
    recipientTokenAccount: PublicKey
    tokenProgram: PublicKey
}

export const layout = borsh.struct([types.CollectFeesParams.layout('params')])

export function collectFees(
    args: CollectFeesArgs,
    accounts: CollectFeesAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
        {
            pubkey: accounts.globalConfigSigner,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: accounts.feeTokenAccount,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: accounts.recipientTokenAccount,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ]
    const identifier = Buffer.from([164, 152, 207, 99, 30, 186, 19, 182])
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
        {
            params: types.CollectFeesParams.toEncodable(args.params),
        },
        buffer
    )
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
