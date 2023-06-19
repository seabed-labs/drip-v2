import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface DepositArgs {
    params: types.DepositParamsFields
}

export interface DepositAccounts {
    signer: PublicKey
    sourceInputTokenAccount: PublicKey
    dripPositionInputTokenAccount: PublicKey
    dripPosition: PublicKey
    tokenProgram: PublicKey
}

export const layout = borsh.struct([types.DepositParams.layout('params')])

export function deposit(
    args: DepositArgs,
    accounts: DepositAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        {
            pubkey: accounts.sourceInputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionInputTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: accounts.dripPosition, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    ]
    const identifier = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182])
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
        {
            params: types.DepositParams.toEncodable(args.params),
        },
        buffer
    )
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
