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
exports.CollectFeesParams = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class CollectFeesParams {
    constructor(fields) {
        this.recipient = fields.recipient
    }
    static layout(property) {
        return borsh.struct([borsh.publicKey('recipient')], property)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj) {
        return new CollectFeesParams({
            recipient: obj.recipient,
        })
    }
    static toEncodable(fields) {
        return {
            recipient: fields.recipient,
        }
    }
    toJSON() {
        return {
            recipient: this.recipient.toString(),
        }
    }
    static fromJSON(obj) {
        return new CollectFeesParams({
            recipient: new web3_js_1.PublicKey(obj.recipient),
        })
    }
    toEncodable() {
        return CollectFeesParams.toEncodable(this)
    }
}
exports.CollectFeesParams = CollectFeesParams
//# sourceMappingURL=CollectFeesParams.js.map
