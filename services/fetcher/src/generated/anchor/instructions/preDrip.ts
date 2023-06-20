// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// PreDripFields are raw anchor decoded values
export interface PreDripFields {
    params: types.PreDripParamsFields
}
// PreDripArgs convert properties to type classes if available. This is used for converting to JSON
export interface PreDripArgs {
    params: types.PreDripParams
}

export interface PreDripFieldsJSON {
    params: types.PreDripParamsJSON
}

export interface PreDripAccounts {
    signer: PublicKey
    instructions: PublicKey
}

export interface PreDripAccountsJSON {
    signer: string
    instructions: string
}

const layout = borsh.struct([types.PreDripParams.layout('params')])

export class PreDrip {
    static readonly ixName = 'preDrip'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: PreDripArgs

    constructor(
        readonly fields: PreDripFields,
        readonly accounts: PreDripAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([34, 16, 105, 194, 1, 128, 80, 115])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.instructions,
                isSigner: false,
                isWritable: false,
            },
        ]
        this.args = {
            params: new types.PreDripParams({ ...fields.params }),
        }
    }

    static fromDecoded(fields: PreDripFields, flattenedAccounts: PublicKey[]) {
        const accounts = {
            signer: flattenedAccounts[0],
            instructions: flattenedAccounts[1],
        }
        return new PreDrip(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.PreDripParams.toEncodable(this.fields.params),
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

    toArgsJSON(): PreDripFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): PreDripAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            instructions: this.accounts.instructions.toString(),
        }
    }
}
