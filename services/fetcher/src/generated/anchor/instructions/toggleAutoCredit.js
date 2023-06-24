'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ToggleAutoCredit = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class ToggleAutoCredit {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([175, 234, 245, 131, 133, 109, 187, 74])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.dripPosition,
                isSigner: false,
                isWritable: true,
            },
        ]
    }
    static fromDecoded(flattenedAccounts) {
        const accounts = {
            signer: flattenedAccounts[0],
            dripPosition: flattenedAccounts[1],
        }
        return new ToggleAutoCredit(accounts)
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
            dripPosition: this.accounts.dripPosition.toString(),
        }
    }
}
exports.ToggleAutoCredit = ToggleAutoCredit
ToggleAutoCredit.ixName = 'toggleAutoCredit'
//# sourceMappingURL=toggleAutoCredit.js.map
