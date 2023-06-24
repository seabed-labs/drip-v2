'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.InitDripPositionNft = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class InitDripPositionNft {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
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
    static fromDecoded(flattenedAccounts) {
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
exports.InitDripPositionNft = InitDripPositionNft
InitDripPositionNft.ixName = 'initDripPositionNft'
//# sourceMappingURL=initDripPositionNft.js.map
