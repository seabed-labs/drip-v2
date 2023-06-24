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
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.DripPosition = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js')
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class DripPosition {
    constructor(fields) {
        this.globalConfig = fields.globalConfig
        this.owner = fields.owner
        this.dripPositionSigner = fields.dripPositionSigner
        this.autoCreditEnabled = fields.autoCreditEnabled
        this.inputTokenMint = fields.inputTokenMint
        this.outputTokenMint = fields.outputTokenMint
        this.inputTokenAccount = fields.inputTokenAccount
        this.outputTokenAccount = fields.outputTokenAccount
        this.dripAmount = fields.dripAmount
        this.frequencyInSeconds = fields.frequencyInSeconds
        this.totalInputTokenDripped = fields.totalInputTokenDripped
        this.totalOutputTokenReceived = fields.totalOutputTokenReceived
        this.dripPositionNftMint = fields.dripPositionNftMint
    }
    static fetch(c, address, programId = programId_1.PROGRAM_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield c.getAccountInfo(address)
            if (info === null) {
                return null
            }
            if (!info.owner.equals(programId)) {
                throw new Error("account doesn't belong to this program")
            }
            return this.decode(info.data)
        })
    }
    static fetchMultiple(c, addresses, programId = programId_1.PROGRAM_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const infos = yield c.getMultipleAccountsInfo(addresses)
            return infos.map((info) => {
                if (info === null) {
                    return null
                }
                if (!info.owner.equals(programId)) {
                    throw new Error("account doesn't belong to this program")
                }
                return this.decode(info.data)
            })
        })
    }
    static decode(data) {
        if (!data.slice(0, 8).equals(DripPosition.discriminator)) {
            throw new Error('invalid account discriminator')
        }
        const dec = DripPosition.layout.decode(data.slice(8))
        return new DripPosition({
            globalConfig: dec.globalConfig,
            owner: types.DripPositionOwner.fromDecoded(dec.owner),
            dripPositionSigner: dec.dripPositionSigner,
            autoCreditEnabled: dec.autoCreditEnabled,
            inputTokenMint: dec.inputTokenMint,
            outputTokenMint: dec.outputTokenMint,
            inputTokenAccount: dec.inputTokenAccount,
            outputTokenAccount: dec.outputTokenAccount,
            dripAmount: dec.dripAmount,
            frequencyInSeconds: dec.frequencyInSeconds,
            totalInputTokenDripped: dec.totalInputTokenDripped,
            totalOutputTokenReceived: dec.totalOutputTokenReceived,
            dripPositionNftMint: dec.dripPositionNftMint,
        })
    }
    toJSON() {
        return {
            globalConfig: this.globalConfig.toString(),
            owner: this.owner.toJSON(),
            dripPositionSigner: this.dripPositionSigner.toString(),
            autoCreditEnabled: this.autoCreditEnabled,
            inputTokenMint: this.inputTokenMint.toString(),
            outputTokenMint: this.outputTokenMint.toString(),
            inputTokenAccount: this.inputTokenAccount.toString(),
            outputTokenAccount: this.outputTokenAccount.toString(),
            dripAmount: this.dripAmount.toString(),
            frequencyInSeconds: this.frequencyInSeconds.toString(),
            totalInputTokenDripped: this.totalInputTokenDripped.toString(),
            totalOutputTokenReceived: this.totalOutputTokenReceived.toString(),
            dripPositionNftMint:
                (this.dripPositionNftMint &&
                    this.dripPositionNftMint.toString()) ||
                null,
        }
    }
    static fromJSON(obj) {
        return new DripPosition({
            globalConfig: new web3_js_1.PublicKey(obj.globalConfig),
            owner: types.DripPositionOwner.fromJSON(obj.owner),
            dripPositionSigner: new web3_js_1.PublicKey(obj.dripPositionSigner),
            autoCreditEnabled: obj.autoCreditEnabled,
            inputTokenMint: new web3_js_1.PublicKey(obj.inputTokenMint),
            outputTokenMint: new web3_js_1.PublicKey(obj.outputTokenMint),
            inputTokenAccount: new web3_js_1.PublicKey(obj.inputTokenAccount),
            outputTokenAccount: new web3_js_1.PublicKey(obj.outputTokenAccount),
            dripAmount: BigInt(obj.dripAmount),
            frequencyInSeconds: BigInt(obj.frequencyInSeconds),
            totalInputTokenDripped: BigInt(obj.totalInputTokenDripped),
            totalOutputTokenReceived: BigInt(obj.totalOutputTokenReceived),
            dripPositionNftMint:
                (obj.dripPositionNftMint &&
                    new web3_js_1.PublicKey(obj.dripPositionNftMint)) ||
                null,
        })
    }
}
exports.DripPosition = DripPosition
DripPosition.discriminator = Buffer.from([4, 250, 161, 172, 41, 156, 53, 219])
DripPosition.layout = borsh.struct([
    borsh.publicKey('globalConfig'),
    types.DripPositionOwner.layout('owner'),
    borsh.publicKey('dripPositionSigner'),
    borsh.bool('autoCreditEnabled'),
    borsh.publicKey('inputTokenMint'),
    borsh.publicKey('outputTokenMint'),
    borsh.publicKey('inputTokenAccount'),
    borsh.publicKey('outputTokenAccount'),
    borsh.u64('dripAmount'),
    borsh.u64('frequencyInSeconds'),
    borsh.u64('totalInputTokenDripped'),
    borsh.u64('totalOutputTokenReceived'),
    borsh.option(borsh.publicKey(), 'dripPositionNftMint'),
])
//# sourceMappingURL=DripPosition.js.map
