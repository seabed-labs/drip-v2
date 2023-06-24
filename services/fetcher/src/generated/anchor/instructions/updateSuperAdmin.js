'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.UpdateSuperAdmin = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class UpdateSuperAdmin {
    constructor(accounts, programId = programId_1.PROGRAM_ID) {
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([17, 235, 69, 101, 141, 150, 237, 220])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.newSuperAdmin,
                isSigner: true,
                isWritable: false,
            },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: true,
            },
        ]
    }
    static fromDecoded(flattenedAccounts) {
        const accounts = {
            signer: flattenedAccounts[0],
            newSuperAdmin: flattenedAccounts[1],
            globalConfig: flattenedAccounts[2],
        }
        return new UpdateSuperAdmin(accounts)
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
            newSuperAdmin: this.accounts.newSuperAdmin.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
        }
    }
}
exports.UpdateSuperAdmin = UpdateSuperAdmin
UpdateSuperAdmin.ixName = 'updateSuperAdmin'
//# sourceMappingURL=updateSuperAdmin.js.map
