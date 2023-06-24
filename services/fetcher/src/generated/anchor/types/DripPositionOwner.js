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
    exports.Tokenized =
    exports.Direct =
        void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class Direct {
    constructor(value) {
        this.discriminator = 0
        this.kind = 'Direct'
        this.value = {
            owner: value.owner,
        }
    }
    toJSON() {
        return {
            kind: 'Direct',
            value: {
                owner: this.value.owner.toString(),
            },
        }
    }
    toEncodable() {
        return {
            Direct: {
                owner: this.value.owner,
            },
        }
    }
}
exports.Direct = Direct
Direct.discriminator = 0
Direct.kind = 'Direct'
class Tokenized {
    constructor() {
        this.discriminator = 1
        this.kind = 'Tokenized'
    }
    toJSON() {
        return {
            kind: 'Tokenized',
        }
    }
    toEncodable() {
        return {
            Tokenized: {},
        }
    }
}
exports.Tokenized = Tokenized
Tokenized.discriminator = 1
Tokenized.kind = 'Tokenized'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDecoded(obj) {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }
    if ('Direct' in obj) {
        const val = obj['Direct']
        return new Direct({
            owner: val['owner'],
        })
    }
    if ('Tokenized' in obj) {
        return new Tokenized()
    }
    throw new Error('Invalid enum object')
}
exports.fromDecoded = fromDecoded
function fromJSON(obj) {
    switch (obj.kind) {
        case 'Direct': {
            return new Direct({
                owner: new web3_js_1.PublicKey(obj.value.owner),
            })
        }
        case 'Tokenized': {
            return new Tokenized()
        }
    }
}
exports.fromJSON = fromJSON
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([borsh.publicKey('owner')], 'Direct'),
        borsh.struct([], 'Tokenized'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
exports.layout = layout
//# sourceMappingURL=DripPositionOwner.js.map
