// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// UpdateAdminFields are raw anchor decoded values
export interface UpdateAdminFields {
    params: types.UpdateAdminParamsFields
}
// UpdateAdminArgs convert properties to type classes if available. This is used for converting to JSON
export interface UpdateAdminArgs {
    params: types.UpdateAdminParams
}

export interface UpdateAdminFieldsJSON {
    params: types.UpdateAdminParamsJSON
}

export interface UpdateAdminAccounts {
    signer: PublicKey
    globalConfig: PublicKey
}

export interface UpdateAdminAccountsJSON {
    signer: string
    globalConfig: string
}

const layout = borsh.struct([types.UpdateAdminParams.layout('params')])

export class UpdateAdmin {
    static readonly ixName = 'updateAdmin'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: UpdateAdminArgs

    constructor(
        readonly fields: UpdateAdminFields,
        readonly accounts: UpdateAdminAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([161, 176, 40, 213, 60, 184, 179, 228])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: true,
            },
        ]
        this.args = {
            params: new types.UpdateAdminParams({ ...fields.params }),
        }
    }

    static fromDecoded(
        fields: UpdateAdminFields,
        flattenedAccounts: PublicKey[]
    ) {
        const accounts = {
            signer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
        }
        return new UpdateAdmin(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.UpdateAdminParams.toEncodable(this.fields.params),
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

    toArgsJSON(): UpdateAdminFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): UpdateAdminAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
        }
    }
}
