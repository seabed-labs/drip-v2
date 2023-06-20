// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface TokenizeDripPositionAccounts {
    payer: PublicKey
    owner: PublicKey
    dripPosition: PublicKey
    dripPositionSigner: PublicKey
    dripPositionNftMint: PublicKey
    dripPositionNftAccount: PublicKey
    systemProgram: PublicKey
    tokenProgram: PublicKey
}

export interface TokenizeDripPositionAccountsJSON {
    payer: string
    owner: string
    dripPosition: string
    dripPositionSigner: string
    dripPositionNftMint: string
    dripPositionNftAccount: string
    systemProgram: string
    tokenProgram: string
}

export class TokenizeDripPosition {
    static readonly ixName = 'tokenizeDripPosition'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>

    constructor(
        readonly accounts: TokenizeDripPositionAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([96, 214, 241, 27, 250, 106, 218, 233])
        this.keys = [
            { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
            { pubkey: this.accounts.owner, isSigner: true, isWritable: false },
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
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionNftAccount,
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
            owner: flattenedAccounts[1],
            dripPosition: flattenedAccounts[2],
            dripPositionSigner: flattenedAccounts[3],
            dripPositionNftMint: flattenedAccounts[4],
            dripPositionNftAccount: flattenedAccounts[5],
            systemProgram: flattenedAccounts[6],
            tokenProgram: flattenedAccounts[7],
        }
        return new TokenizeDripPosition(accounts)
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

    toAccountsJSON(): TokenizeDripPositionAccountsJSON {
        return {
            payer: this.accounts.payer.toString(),
            owner: this.accounts.owner.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
            dripPositionSigner: this.accounts.dripPositionSigner.toString(),
            dripPositionNftMint: this.accounts.dripPositionNftMint.toString(),
            dripPositionNftAccount:
                this.accounts.dripPositionNftAccount.toString(),
            systemProgram: this.accounts.systemProgram.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
        }
    }
}
