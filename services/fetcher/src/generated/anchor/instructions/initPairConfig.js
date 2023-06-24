'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.InitPairConfig = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class InitPairConfig {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([205, 58, 197, 248, 181, 39, 56, 152])
        this.keys = [
            { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
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
                pubkey: this.accounts.pairConfig,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.systemProgram,
                isSigner: false,
                isWritable: false,
            },
        ]
    }
    static fromDecoded(flattenedAccounts) {
        const accounts = {
            payer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
            inputTokenMint: flattenedAccounts[2],
            outputTokenMint: flattenedAccounts[3],
            pairConfig: flattenedAccounts[4],
            systemProgram: flattenedAccounts[5],
        }
        return new InitPairConfig(accounts)
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
            globalConfig: this.accounts.globalConfig.toString(),
            inputTokenMint: this.accounts.inputTokenMint.toString(),
            outputTokenMint: this.accounts.outputTokenMint.toString(),
            pairConfig: this.accounts.pairConfig.toString(),
            systemProgram: this.accounts.systemProgram.toString(),
        }
    }
}
exports.InitPairConfig = InitPairConfig
InitPairConfig.ixName = 'initPairConfig'
//# sourceMappingURL=initPairConfig.js.map
