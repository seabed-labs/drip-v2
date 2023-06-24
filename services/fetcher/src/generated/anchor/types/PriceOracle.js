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
exports.layout =
    exports.fromJSON =
    exports.fromDecoded =
    exports.Pyth =
    exports.Unavailable =
        void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class Unavailable {
    constructor() {
        this.discriminator = 0
        this.kind = 'Unavailable'
    }
    toJSON() {
        return {
            kind: 'Unavailable',
        }
    }
    toEncodable() {
        return {
            Unavailable: {},
        }
    }
}
exports.Unavailable = Unavailable
Unavailable.discriminator = 0
Unavailable.kind = 'Unavailable'
class Pyth {
    constructor(value) {
        this.discriminator = 1
        this.kind = 'Pyth'
        this.value = {
            pythPriceFeedAccount: value.pythPriceFeedAccount,
        }
    }
    toJSON() {
        return {
            kind: 'Pyth',
            value: {
                pythPriceFeedAccount:
                    this.value.pythPriceFeedAccount.toString(),
            },
        }
    }
    toEncodable() {
        return {
            Pyth: {
                pyth_price_feed_account: this.value.pythPriceFeedAccount,
            },
        }
    }
}
exports.Pyth = Pyth
Pyth.discriminator = 1
Pyth.kind = 'Pyth'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDecoded(obj) {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }
    if ('Unavailable' in obj) {
        return new Unavailable()
    }
    if ('Pyth' in obj) {
        const val = obj['Pyth']
        return new Pyth({
            pythPriceFeedAccount: val['pyth_price_feed_account'],
        })
    }
    throw new Error('Invalid enum object')
}
exports.fromDecoded = fromDecoded
function fromJSON(obj) {
    switch (obj.kind) {
        case 'Unavailable': {
            return new Unavailable()
        }
        case 'Pyth': {
            return new Pyth({
                pythPriceFeedAccount: new web3_js_1.PublicKey(
                    obj.value.pythPriceFeedAccount
                ),
            })
        }
    }
}
exports.fromJSON = fromJSON
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([], 'Unavailable'),
        borsh.struct([borsh.publicKey('pyth_price_feed_account')], 'Pyth'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
exports.layout = layout
//# sourceMappingURL=PriceOracle.js.map
