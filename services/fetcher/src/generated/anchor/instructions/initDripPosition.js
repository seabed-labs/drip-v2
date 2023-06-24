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
exports.InitDripPosition = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
const layout = borsh.struct([types.InitDripPositionParams.layout('params')])
class InitDripPosition {
    constructor(fields, accounts, programId = programId_1.PROGRAM_ID) {
        this.fields = fields
        this.accounts = accounts
        this.programId = programId
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
            params: new types.InitDripPositionParams(
                Object.assign({}, fields.params)
            ),
        }
    }
    static fromDecoded(fields, flattenedAccounts) {
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
exports.InitDripPosition = InitDripPosition
InitDripPosition.ixName = 'initDripPosition'
//# sourceMappingURL=initDripPosition.js.map
