import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface PostDripArgs {
    params: types.PostDripParamsFields
}

export interface PostDripAccounts {
    signer: PublicKey
}

export const layout = borsh.struct([types.PostDripParams.layout('params')])

export function postDrip(
    args: PostDripArgs,
    accounts: PostDripAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
    ]
    const identifier = Buffer.from([189, 98, 59, 156, 65, 141, 5, 198])
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
        {
            params: types.PostDripParams.toEncodable(args.params),
        },
        buffer
    )
    const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
