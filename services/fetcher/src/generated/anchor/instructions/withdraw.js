'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              var desc = Object.getOwnPropertyDescriptor(m, k)
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k]
                      },
                  }
              }
              Object.defineProperty(o, k2, desc)
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.Withdraw = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
const layout = borsh.struct([types.WithdrawParams.layout('params')])
class Withdraw {
    constructor(fields, accounts, programId = programId_1.PROGRAM_ID) {
        this.fields = fields
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.destinationInputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.destinationOutputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionInputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionOutputTokenAccount,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.dripPositionNftMint,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.dripPositionNftAccount,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.dripPosition,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.dripPositionSigner,
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
            params: new types.WithdrawParams(Object.assign({}, fields.params)),
        }
    }
    static fromDecoded(fields, flattenedAccounts) {
        const accounts = {
            signer: flattenedAccounts[0],
            destinationInputTokenAccount: flattenedAccounts[1],
            destinationOutputTokenAccount: flattenedAccounts[2],
            dripPositionInputTokenAccount: flattenedAccounts[3],
            dripPositionOutputTokenAccount: flattenedAccounts[4],
            dripPositionNftMint: flattenedAccounts[5],
            dripPositionNftAccount: flattenedAccounts[6],
            dripPosition: flattenedAccounts[7],
            dripPositionSigner: flattenedAccounts[8],
            tokenProgram: flattenedAccounts[9],
        }
        return new Withdraw(fields, accounts)
    }
    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.WithdrawParams.toEncodable(this.fields.params),
            },
            buffer
        )
        const data = Buffer.concat([this.identifier, buffer]).slice(0, 8 + len)
        const ix = new web3_js_1.TransactionInstruction({
            keys: this.keys,
            programId: this.programId,
            data,
        })
        return ix
    }
    toArgsJSON() {
        return {
            params: this.args.params.toJSON(),
        }
    }
    toAccountsJSON() {
        return {
            signer: this.accounts.signer.toString(),
            destinationInputTokenAccount:
                this.accounts.destinationInputTokenAccount.toString(),
            destinationOutputTokenAccount:
                this.accounts.destinationOutputTokenAccount.toString(),
            dripPositionInputTokenAccount:
                this.accounts.dripPositionInputTokenAccount.toString(),
            dripPositionOutputTokenAccount:
                this.accounts.dripPositionOutputTokenAccount.toString(),
            dripPositionNftMint: this.accounts.dripPositionNftMint.toString(),
            dripPositionNftAccount:
                this.accounts.dripPositionNftAccount.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
            dripPositionSigner: this.accounts.dripPositionSigner.toString(),
            tokenProgram: this.accounts.tokenProgram.toString(),
        }
    }
}
exports.Withdraw = Withdraw
Withdraw.ixName = 'withdraw'
//# sourceMappingURL=withdraw.js.map
