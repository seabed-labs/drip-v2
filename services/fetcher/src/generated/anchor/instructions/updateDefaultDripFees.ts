// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// UpdateDefaultDripFeesFields are raw anchor decoded values
export interface UpdateDefaultDripFeesFields {
    params: types.UpdateDefaultDripFeesParamsFields
}
// UpdateDefaultDripFeesArgs convert properties to type classes if available. This is used for converting to JSON
export interface UpdateDefaultDripFeesArgs {
    params: types.UpdateDefaultDripFeesParams
}

export interface UpdateDefaultDripFeesFieldsJSON {
    params: types.UpdateDefaultDripFeesParamsJSON
}

export interface UpdateDefaultDripFeesAccounts {
    signer: PublicKey
    globalConfig: PublicKey
}

export interface UpdateDefaultDripFeesAccountsJSON {
    signer: string
    globalConfig: string
}

const layout = borsh.struct([
    types.UpdateDefaultDripFeesParams.layout('params'),
])

export class UpdateDefaultDripFees {
    static readonly ixName = 'updateDefaultDripFees'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: UpdateDefaultDripFeesArgs

    constructor(
        readonly fields: UpdateDefaultDripFeesFields,
        readonly accounts: UpdateDefaultDripFeesAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([45, 99, 218, 191, 20, 128, 35, 142])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: true,
            },
        ]
        this.args = {
            params: new types.UpdateDefaultDripFeesParams({ ...fields.params }),
        }
    }

    static fromDecoded(
        fields: UpdateDefaultDripFeesFields,
        flattenedAccounts: PublicKey[]
    ) {
        const accounts = {
            signer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
        }
        return new UpdateDefaultDripFees(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.UpdateDefaultDripFeesParams.toEncodable(
                    this.fields.params
                ),
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

    toArgsJSON(): UpdateDefaultDripFeesFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): UpdateDefaultDripFeesAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
        }
    }
}
