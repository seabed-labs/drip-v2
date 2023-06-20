// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// CollectFeesFields are raw anchor decoded values
export interface CollectFeesFields {
    params: types.CollectFeesParamsFields
}
// CollectFeesArgs convert properties to type classes if available. This is used for converting to JSON
export interface CollectFeesArgs {
    params: types.CollectFeesParams
}

export interface CollectFeesFieldsJSON {
    params: types.CollectFeesParamsJSON
}

export interface CollectFeesAccounts {
    signer: PublicKey
    globalConfig: PublicKey
    globalConfigSigner: PublicKey
    feeTokenAccount: PublicKey
    recipientTokenAccount: PublicKey
    tokenProgram: PublicKey
}

export interface CollectFeesAccountsJSON {
    signer: string
    globalConfig: string
    globalConfigSigner: string
    feeTokenAccount: string
    recipientTokenAccount: string
    tokenProgram: string
}

const layout = borsh.struct([types.CollectFeesParams.layout('params')])

export class CollectFees {
    static readonly ixName = 'collectFees'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: CollectFeesArgs

    constructor(
        readonly fields: CollectFeesFields,
        readonly accounts: CollectFeesAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([164, 152, 207, 99, 30, 186, 19, 182])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.globalConfigSigner,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.feeTokenAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.recipientTokenAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.tokenProgram,
                isSigner: false,
                isWritable: false,
            },
        ]
        this.args = {
            params: new types.CollectFeesParams({ ...fields.params }),
        }
    }

    static fromDecoded(
        fields: CollectFeesFields,
        flattenedAccounts: PublicKey[]
    ) {
        const accounts = {
            signer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
            globalConfigSigner: flattenedAccounts[2],
            feeTokenAccount: flattenedAccounts[3],
            recipientTokenAccount: flattenedAccounts[4],
            tokenProgram: flattenedAccounts[5],
        }
        return new CollectFees(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.CollectFeesParams.toEncodable(this.fields.params),
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

    toArgsJSON(): CollectFeesFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): CollectFeesAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
            globalConfigSigner: this.accounts.globalConfigSigner.toString(),
            feeTokenAccount: this.accounts.feeTokenAccount.toString(),
            recipientTokenAccount:
                this.accounts.recipientTokenAccount.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
        }
    }
}
