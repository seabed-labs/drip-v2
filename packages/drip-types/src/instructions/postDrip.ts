// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// PostDripFields are raw anchor decoded values
export interface PostDripFields {
    params: types.PostDripParamsFields
}
// PostDripArgs convert properties to type classes if available. This is used for converting to JSON
export interface PostDripArgs {
    params: types.PostDripParams
}

export interface PostDripFieldsJSON {
    params: types.PostDripParamsJSON
}

export interface PostDripAccounts {
    signer: PublicKey
}

export interface PostDripAccountsJSON {
    signer: string
}

const layout = borsh.struct([types.PostDripParams.layout('params')])

export class PostDrip {
    static readonly ixName = 'postDrip'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: PostDripArgs

    constructor(
        readonly fields: PostDripFields,
        readonly accounts: PostDripAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([189, 98, 59, 156, 65, 141, 5, 198])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
        ]
        this.args = {
            params: new types.PostDripParams({ ...fields.params }),
        }
    }

    static fromDecoded(fields: PostDripFields, flattenedAccounts: PublicKey[]) {
        const accounts = {
            signer: flattenedAccounts[0],
        }
        return new PostDrip(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.PostDripParams.toEncodable(this.fields.params),
            },
            buffer
        )
        const data = Buffer.concat([this.identifier, buffer]).slice(0, 8 + len)
        const ix = new TransactionInstruction({
            keys: this.keys,
            programId: this.programId,
            data,
        })
        return ix
    }

    toArgsJSON(): PostDripFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): PostDripAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
        }
    }
}
