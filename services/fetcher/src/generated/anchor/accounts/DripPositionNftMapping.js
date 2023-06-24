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
exports.DripPositionNftMapping = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js')
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class DripPositionNftMapping {
    constructor(fields) {
        this.version = fields.version
        this.dripPositionNftMint = fields.dripPositionNftMint
        this.dripPosition = fields.dripPosition
        this.bump = fields.bump
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
        if (!data.slice(0, 8).equals(DripPositionNftMapping.discriminator)) {
            throw new Error('invalid account discriminator')
        }
        const dec = DripPositionNftMapping.layout.decode(data.slice(8))
        return new DripPositionNftMapping({
            version: dec.version,
            dripPositionNftMint: dec.dripPositionNftMint,
            dripPosition: dec.dripPosition,
            bump: dec.bump,
        })
    }
    toJSON() {
        return {
            version: this.version,
            dripPositionNftMint: this.dripPositionNftMint.toString(),
            dripPosition: this.dripPosition.toString(),
            bump: this.bump,
        }
    }
    static fromJSON(obj) {
        return new DripPositionNftMapping({
            version: obj.version,
            dripPositionNftMint: new web3_js_1.PublicKey(
                obj.dripPositionNftMint
            ),
            dripPosition: new web3_js_1.PublicKey(obj.dripPosition),
            bump: obj.bump,
        })
    }
}
exports.DripPositionNftMapping = DripPositionNftMapping
DripPositionNftMapping.discriminator = Buffer.from([
    169, 140, 220, 36, 255, 38, 150, 167,
])
DripPositionNftMapping.layout = borsh.struct([
    borsh.u8('version'),
    borsh.publicKey('dripPositionNftMint'),
    borsh.publicKey('dripPosition'),
    borsh.u8('bump'),
])
//# sourceMappingURL=DripPositionNftMapping.js.map
