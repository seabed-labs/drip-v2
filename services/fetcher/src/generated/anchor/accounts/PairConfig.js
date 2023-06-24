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
exports.PairConfig = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js')
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class PairConfig {
    constructor(fields) {
        this.version = fields.version
        this.globalConfig = fields.globalConfig
        this.inputTokenMint = fields.inputTokenMint
        this.outputTokenMint = fields.outputTokenMint
        this.bump = fields.bump
        this.defaultPairDripFeeBps = fields.defaultPairDripFeeBps
        this.inputTokenDripFeePortionBps = fields.inputTokenDripFeePortionBps
        this.inputTokenPriceOracle = fields.inputTokenPriceOracle
        this.outputTokenPriceOracle = fields.outputTokenPriceOracle
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
        if (!data.slice(0, 8).equals(PairConfig.discriminator)) {
            throw new Error('invalid account discriminator')
        }
        const dec = PairConfig.layout.decode(data.slice(8))
        return new PairConfig({
            version: dec.version,
            globalConfig: dec.globalConfig,
            inputTokenMint: dec.inputTokenMint,
            outputTokenMint: dec.outputTokenMint,
            bump: dec.bump,
            defaultPairDripFeeBps: dec.defaultPairDripFeeBps,
            inputTokenDripFeePortionBps: dec.inputTokenDripFeePortionBps,
            inputTokenPriceOracle: types.PriceOracle.fromDecoded(
                dec.inputTokenPriceOracle
            ),
            outputTokenPriceOracle: types.PriceOracle.fromDecoded(
                dec.outputTokenPriceOracle
            ),
        })
    }
    toJSON() {
        return {
            version: this.version,
            globalConfig: this.globalConfig.toString(),
            inputTokenMint: this.inputTokenMint.toString(),
            outputTokenMint: this.outputTokenMint.toString(),
            bump: this.bump,
            defaultPairDripFeeBps: this.defaultPairDripFeeBps.toString(),
            inputTokenDripFeePortionBps:
                this.inputTokenDripFeePortionBps.toString(),
            inputTokenPriceOracle: this.inputTokenPriceOracle.toJSON(),
            outputTokenPriceOracle: this.outputTokenPriceOracle.toJSON(),
        }
    }
    static fromJSON(obj) {
        return new PairConfig({
            version: obj.version,
            globalConfig: new web3_js_1.PublicKey(obj.globalConfig),
            inputTokenMint: new web3_js_1.PublicKey(obj.inputTokenMint),
            outputTokenMint: new web3_js_1.PublicKey(obj.outputTokenMint),
            bump: obj.bump,
            defaultPairDripFeeBps: BigInt(obj.defaultPairDripFeeBps),
            inputTokenDripFeePortionBps: BigInt(
                obj.inputTokenDripFeePortionBps
            ),
            inputTokenPriceOracle: types.PriceOracle.fromJSON(
                obj.inputTokenPriceOracle
            ),
            outputTokenPriceOracle: types.PriceOracle.fromJSON(
                obj.outputTokenPriceOracle
            ),
        })
    }
}
exports.PairConfig = PairConfig
PairConfig.discriminator = Buffer.from([119, 167, 13, 129, 136, 228, 151, 77])
PairConfig.layout = borsh.struct([
    borsh.u8('version'),
    borsh.publicKey('globalConfig'),
    borsh.publicKey('inputTokenMint'),
    borsh.publicKey('outputTokenMint'),
    borsh.u8('bump'),
    borsh.u64('defaultPairDripFeeBps'),
    borsh.u64('inputTokenDripFeePortionBps'),
    types.PriceOracle.layout('inputTokenPriceOracle'),
    types.PriceOracle.layout('outputTokenPriceOracle'),
])
//# sourceMappingURL=PairConfig.js.map
