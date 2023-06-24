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
exports.WithdrawParams = void 0
const bn_js_1 = __importDefault(require('bn.js')) // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class WithdrawParams {
    constructor(fields) {
        this.withdrawInputAmount = fields.withdrawInputAmount
        this.withdrawOutputAmount = fields.withdrawOutputAmount
    }
    static layout(property) {
        return borsh.struct(
            [
                borsh.u64('withdrawInputAmount'),
                borsh.u64('withdrawOutputAmount'),
            ],
            property
        )
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj) {
        return new WithdrawParams({
            withdrawInputAmount: obj.withdrawInputAmount,
            withdrawOutputAmount: obj.withdrawOutputAmount,
        })
    }
    static toEncodable(fields) {
        return {
            withdrawInputAmount: new bn_js_1.default(
                fields.withdrawInputAmount.toString()
            ),
            withdrawOutputAmount: new bn_js_1.default(
                fields.withdrawOutputAmount.toString()
            ),
        }
    }
    toJSON() {
        return {
            withdrawInputAmount: this.withdrawInputAmount.toString(),
            withdrawOutputAmount: this.withdrawOutputAmount.toString(),
        }
    }
    static fromJSON(obj) {
        return new WithdrawParams({
            withdrawInputAmount: BigInt(obj.withdrawInputAmount),
            withdrawOutputAmount: BigInt(obj.withdrawOutputAmount),
        })
    }
    toEncodable() {
        return WithdrawParams.toEncodable(this)
    }
}
exports.WithdrawParams = WithdrawParams
//# sourceMappingURL=WithdrawParams.js.map
