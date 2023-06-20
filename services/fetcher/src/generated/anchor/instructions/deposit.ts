// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// DepositFields are raw anchor decoded values
export interface DepositFields {
    params: types.DepositParamsFields
}
// DepositArgs convert properties to type classes if available. This is used for converting to JSON
export interface DepositArgs {
    params: types.DepositParams
}

export interface DepositFieldsJSON {
    params: types.DepositParamsJSON
}

export interface DepositAccounts {
    signer: PublicKey
    sourceInputTokenAccount: PublicKey
    dripPositionInputTokenAccount: PublicKey
    dripPosition: PublicKey
    tokenProgram: PublicKey
}

export interface DepositAccountsJSON {
    signer: string
    sourceInputTokenAccount: string
    dripPositionInputTokenAccount: string
    dripPosition: string
    tokenProgram: string
}

const layout = borsh.struct([types.DepositParams.layout('params')])

export class Deposit {
    static readonly ixName = 'deposit'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: DepositArgs

    constructor(
        readonly fields: DepositFields,
        readonly accounts: DepositAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([242, 35, 198, 137, 82, 225, 242, 182])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.sourceInputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionInputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPosition,
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
            params: new types.DepositParams({ ...fields.params }),
        }
    }

    static fromDecoded(fields: DepositFields, flattenedAccounts: PublicKey[]) {
        const accounts = {
            signer: flattenedAccounts[0],
            sourceInputTokenAccount: flattenedAccounts[1],
            dripPositionInputTokenAccount: flattenedAccounts[2],
            dripPosition: flattenedAccounts[3],
            tokenProgram: flattenedAccounts[4],
        }
        return new Deposit(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.DepositParams.toEncodable(this.fields.params),
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

    toArgsJSON(): DepositFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): DepositAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            sourceInputTokenAccount:
                this.accounts.sourceInputTokenAccount.toString(),
            dripPositionInputTokenAccount:
                this.accounts.dripPositionInputTokenAccount.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
        }
    }
}
