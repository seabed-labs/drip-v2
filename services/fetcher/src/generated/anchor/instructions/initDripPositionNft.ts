// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitDripPositionNftAccounts {
    payer: PublicKey
    dripPosition: PublicKey
    dripPositionSigner: PublicKey
    dripPositionNftMint: PublicKey
    dripPositionNftMapping: PublicKey
    systemProgram: PublicKey
    tokenProgram: PublicKey
}

export interface InitDripPositionNftAccountsJSON {
    payer: string
    dripPosition: string
    dripPositionSigner: string
    dripPositionNftMint: string
    dripPositionNftMapping: string
    systemProgram: string
    tokenProgram: string
}

export class InitDripPositionNft {
    static readonly ixName = 'initDripPositionNft'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>

    constructor(
        readonly accounts: InitDripPositionNftAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([143, 9, 195, 8, 246, 10, 71, 31])
        this.keys = [
            { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
            {
                pubkey: this.accounts.dripPosition,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionSigner,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.dripPositionNftMint,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionNftMapping,
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
        ]
    }

    static fromDecoded(flattenedAccounts: PublicKey[]) {
        const accounts = {
            payer: flattenedAccounts[0],
            dripPosition: flattenedAccounts[1],
            dripPositionSigner: flattenedAccounts[2],
            dripPositionNftMint: flattenedAccounts[3],
            dripPositionNftMapping: flattenedAccounts[4],
            systemProgram: flattenedAccounts[5],
            tokenProgram: flattenedAccounts[6],
        }
        return new InitDripPositionNft(accounts)
    }

    build() {
        const data = this.identifier
        const ix = new TransactionInstruction({
            keys: this.keys,
            programId: this.programId,
            data,
        })
        return ix
    }

    toAccountsJSON(): InitDripPositionNftAccountsJSON {
        return {
            payer: this.accounts.payer.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
            dripPositionSigner: this.accounts.dripPositionSigner.toString(),
            dripPositionNftMint: this.accounts.dripPositionNftMint.toString(),
            dripPositionNftMapping:
                this.accounts.dripPositionNftMapping.toString(),
            systemProgram: this.accounts.systemProgram.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
        }
    }
}
