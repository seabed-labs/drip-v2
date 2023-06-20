// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'
// InitDripPositionFields are raw anchor decoded values
export interface InitDripPositionFields {
    params: types.InitDripPositionParamsFields
}
// InitDripPositionArgs convert properties to type classes if available. This is used for converting to JSON
export interface InitDripPositionArgs {
    params: types.InitDripPositionParams
}

export interface InitDripPositionFieldsJSON {
    params: types.InitDripPositionParamsJSON
}

export interface InitDripPositionAccounts {
    payer: PublicKey
    owner: PublicKey
    globalConfig: PublicKey
    inputTokenMint: PublicKey
    outputTokenMint: PublicKey
    inputTokenAccount: PublicKey
    outputTokenAccount: PublicKey
    dripPosition: PublicKey
    dripPositionSigner: PublicKey
    systemProgram: PublicKey
    tokenProgram: PublicKey
    associatedTokenProgram: PublicKey
}

export interface InitDripPositionAccountsJSON {
    payer: string
    owner: string
    globalConfig: string
    inputTokenMint: string
    outputTokenMint: string
    inputTokenAccount: string
    outputTokenAccount: string
    dripPosition: string
    dripPositionSigner: string
    systemProgram: string
    tokenProgram: string
    associatedTokenProgram: string
}

const layout = borsh.struct([types.InitDripPositionParams.layout('params')])

export class InitDripPosition {
    static readonly ixName = 'initDripPosition'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>
    readonly args: InitDripPositionArgs

    constructor(
        readonly fields: InitDripPositionFields,
        readonly accounts: InitDripPositionAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([73, 22, 223, 127, 21, 114, 122, 57])
        this.keys = [
            { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
            { pubkey: this.accounts.owner, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.inputTokenMint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.outputTokenMint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.inputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.outputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPosition,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionSigner,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.systemProgram,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.tokenProgram,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.associatedTokenProgram,
                isSigner: false,
                isWritable: false,
            },
        ]
        this.args = {
            params: new types.InitDripPositionParams({ ...fields.params }),
        }
    }

    static fromDecoded(
        fields: InitDripPositionFields,
        flattenedAccounts: PublicKey[]
    ) {
        const accounts = {
            payer: flattenedAccounts[0],
            owner: flattenedAccounts[1],
            globalConfig: flattenedAccounts[2],
            inputTokenMint: flattenedAccounts[3],
            outputTokenMint: flattenedAccounts[4],
            inputTokenAccount: flattenedAccounts[5],
            outputTokenAccount: flattenedAccounts[6],
            dripPosition: flattenedAccounts[7],
            dripPositionSigner: flattenedAccounts[8],
            systemProgram: flattenedAccounts[9],
            tokenProgram: flattenedAccounts[10],
            associatedTokenProgram: flattenedAccounts[11],
        }
        return new InitDripPosition(fields, accounts)
    }

    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.InitDripPositionParams.toEncodable(
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

    toArgsJSON(): InitDripPositionFieldsJSON {
        return {
            params: this.args.params.toJSON(),
        }
    }

    toAccountsJSON(): InitDripPositionAccountsJSON {
        return {
            payer: this.accounts.payer.toString(),
            owner: this.accounts.owner.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
            inputTokenMint: this.accounts.inputTokenMint.toString(),
            outputTokenMint: this.accounts.outputTokenMint.toString(),
            inputTokenAccount: this.accounts.inputTokenAccount.toString(),
            outputTokenAccount: this.accounts.outputTokenAccount.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
            dripPositionSigner: this.accounts.dripPositionSigner.toString(),
            systemProgram: this.accounts.systemProgram.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
            associatedTokenProgram:
                this.accounts.associatedTokenProgram.toString(),
        }
    }
}
