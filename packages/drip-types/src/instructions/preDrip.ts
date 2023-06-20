import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface PreDripArgs {
    params: types.PreDripParamsFields
}

export interface PreDripAccounts {
    signer: PublicKey
    instructions: PublicKey
}

export const layout = borsh.struct([types.PreDripParams.layout('params')])

export function preDrip(
    args: PreDripArgs,
    accounts: PreDripAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.instructions, isSigner: false, isWritable: false },
    ]
    const identifier = Buffer.from([34, 16, 105, 194, 1, 128, 80, 115])
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
        {
            params: types.PreDripParams.toEncodable(args.params),
        },
        buffer
    )
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
