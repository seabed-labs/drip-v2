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
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod }
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.InitGlobalConfigParams = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const bn_js_1 = __importDefault(require('bn.js')) // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class InitGlobalConfigParams {
    constructor(fields) {
        this.superAdmin = fields.superAdmin
        this.defaultDripFeeBps = fields.defaultDripFeeBps
    }
    static layout(property) {
        return borsh.struct(
            [borsh.publicKey('superAdmin'), borsh.u64('defaultDripFeeBps')],
            property
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj) {
        return new InitGlobalConfigParams({
            superAdmin: obj.superAdmin,
            defaultDripFeeBps: obj.defaultDripFeeBps,
        })
    }
    static toEncodable(fields) {
        return {
            superAdmin: fields.superAdmin,
            defaultDripFeeBps: new bn_js_1.default(
                fields.defaultDripFeeBps.toString()
            ),
        }
    }
    toJSON() {
        return {
            superAdmin: this.superAdmin.toString(),
            defaultDripFeeBps: this.defaultDripFeeBps.toString(),
        }
    }
    static fromJSON(obj) {
        return new InitGlobalConfigParams({
            superAdmin: new web3_js_1.PublicKey(obj.superAdmin),
            defaultDripFeeBps: BigInt(obj.defaultDripFeeBps),
        })
    }
    toEncodable() {
        return InitGlobalConfigParams.toEncodable(this)
    }
}
exports.InitGlobalConfigParams = InitGlobalConfigParams
//# sourceMappingURL=InitGlobalConfigParams.js.map
