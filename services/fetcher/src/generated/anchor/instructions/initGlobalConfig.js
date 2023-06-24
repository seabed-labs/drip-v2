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
exports.InitGlobalConfig = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
const layout = borsh.struct([types.InitGlobalConfigParams.layout('params')])
class InitGlobalConfig {
    constructor(fields, accounts, programId = programId_1.PROGRAM_ID) {
        this.fields = fields
        this.accounts = accounts
        this.programId = programId
        this.identifier = Buffer.from([140, 136, 214, 48, 87, 0, 120, 255])
        this.keys = [
            { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: true,
                isWritable: true,
            },
            {
                pubkey: this.accounts.globalConfigSigner,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.systemProgram,
                isSigner: false,
                isWritable: false,
            },
        ]
        this.args = {
            params: new types.InitGlobalConfigParams(
                Object.assign({}, fields.params)
            ),
        }
    }
    static fromDecoded(fields, flattenedAccounts) {
        const accounts = {
            payer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
            globalConfigSigner: flattenedAccounts[2],
            systemProgram: flattenedAccounts[3],
        }
        return new InitGlobalConfig(fields, accounts)
    }
    build() {
        const buffer = Buffer.alloc(1000)
        const len = layout.encode(
            {
                params: types.InitGlobalConfigParams.toEncodable(
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
            globalConfig: this.accounts.globalConfig.toString(),
            globalConfigSigner: this.accounts.globalConfigSigner.toString(),
            systemProgram: this.accounts.systemProgram.toString(),
        }
    }
}
exports.InitGlobalConfig = InitGlobalConfig
InitGlobalConfig.ixName = 'initGlobalConfig'
//# sourceMappingURL=initGlobalConfig.js.map
