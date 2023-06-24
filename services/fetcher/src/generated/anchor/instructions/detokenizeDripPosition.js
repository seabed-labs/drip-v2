'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.DetokenizeDripPosition = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class DetokenizeDripPosition {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([160, 58, 139, 72, 132, 220, 131, 18])
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
    static fromDecoded(flattenedAccounts) {
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
        return new DetokenizeDripPosition(accounts)
    }
    build() {
        const data = this.identifier
        const ix = new web3_js_1.TransactionInstruction({
            keys: this.keys,
            programId: this.programId,
            data,
        })
        return ix
    }
    toAccountsJSON() {
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
exports.DetokenizeDripPosition = DetokenizeDripPosition
DetokenizeDripPosition.ixName = 'detokenizeDripPosition'
//# sourceMappingURL=detokenizeDripPosition.js.map
