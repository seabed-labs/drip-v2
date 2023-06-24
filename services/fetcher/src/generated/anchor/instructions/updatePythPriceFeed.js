'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.UpdatePythPriceFeed = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class UpdatePythPriceFeed {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([143, 59, 241, 166, 49, 225, 12, 238])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.pairConfig,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.inputTokenPythPriceFeed,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.outputTokenPythPriceFeed,
                isSigner: false,
                isWritable: false,
            },
        ]
    }
    static fromDecoded(flattenedAccounts) {
        const accounts = {
            signer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
            pairConfig: flattenedAccounts[2],
            inputTokenPythPriceFeed: flattenedAccounts[3],
            outputTokenPythPriceFeed: flattenedAccounts[4],
        }
        return new UpdatePythPriceFeed(accounts)
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
            signer: this.accounts.signer.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
            pairConfig: this.accounts.pairConfig.toString(),
            inputTokenPythPriceFeed:
                this.accounts.inputTokenPythPriceFeed.toString(),
            outputTokenPythPriceFeed:
                this.accounts.outputTokenPythPriceFeed.toString(),
        }
    }
}
exports.UpdatePythPriceFeed = UpdatePythPriceFeed
UpdatePythPriceFeed.ixName = 'updatePythPriceFeed'
//# sourceMappingURL=updatePythPriceFeed.js.map
