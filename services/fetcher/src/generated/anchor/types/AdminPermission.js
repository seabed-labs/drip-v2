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
    exports.CollectFees =
    exports.UpdateDefaultPairDripFees =
    exports.UpdatePythPriceFeed =
    exports.UpdateDefaultDripFees =
    exports.Drip =
        void 0
const borsh = __importStar(require('@coral-xyz/borsh'))
class Drip {
    constructor() {
        this.discriminator = 0
        this.kind = 'Drip'
    }
    toJSON() {
        return {
            kind: 'Drip',
        }
    }
    toEncodable() {
        return {
            Drip: {},
        }
    }
}
exports.Drip = Drip
Drip.discriminator = 0
Drip.kind = 'Drip'
class UpdateDefaultDripFees {
    constructor() {
        this.discriminator = 1
        this.kind = 'UpdateDefaultDripFees'
    }
    toJSON() {
        return {
            kind: 'UpdateDefaultDripFees',
        }
    }
    toEncodable() {
        return {
            UpdateDefaultDripFees: {},
        }
    }
}
exports.UpdateDefaultDripFees = UpdateDefaultDripFees
UpdateDefaultDripFees.discriminator = 1
UpdateDefaultDripFees.kind = 'UpdateDefaultDripFees'
class UpdatePythPriceFeed {
    constructor() {
        this.discriminator = 2
        this.kind = 'UpdatePythPriceFeed'
    }
    toJSON() {
        return {
            kind: 'UpdatePythPriceFeed',
        }
    }
    toEncodable() {
        return {
            UpdatePythPriceFeed: {},
        }
    }
}
exports.UpdatePythPriceFeed = UpdatePythPriceFeed
UpdatePythPriceFeed.discriminator = 2
UpdatePythPriceFeed.kind = 'UpdatePythPriceFeed'
class UpdateDefaultPairDripFees {
    constructor() {
        this.discriminator = 3
        this.kind = 'UpdateDefaultPairDripFees'
    }
    toJSON() {
        return {
            kind: 'UpdateDefaultPairDripFees',
        }
    }
    toEncodable() {
        return {
            UpdateDefaultPairDripFees: {},
        }
    }
}
exports.UpdateDefaultPairDripFees = UpdateDefaultPairDripFees
UpdateDefaultPairDripFees.discriminator = 3
UpdateDefaultPairDripFees.kind = 'UpdateDefaultPairDripFees'
class CollectFees {
    constructor() {
        this.discriminator = 4
        this.kind = 'CollectFees'
    }
    toJSON() {
        return {
            kind: 'CollectFees',
        }
    }
    toEncodable() {
        return {
            CollectFees: {},
        }
    }
}
exports.CollectFees = CollectFees
CollectFees.discriminator = 4
CollectFees.kind = 'CollectFees'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDecoded(obj) {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }
    if ('Drip' in obj) {
        return new Drip()
    }
    if ('UpdateDefaultDripFees' in obj) {
        return new UpdateDefaultDripFees()
    }
    if ('UpdatePythPriceFeed' in obj) {
        return new UpdatePythPriceFeed()
    }
    if ('UpdateDefaultPairDripFees' in obj) {
        return new UpdateDefaultPairDripFees()
    }
    if ('CollectFees' in obj) {
        return new CollectFees()
    }
    throw new Error('Invalid enum object')
}
exports.fromDecoded = fromDecoded
function fromJSON(obj) {
    switch (obj.kind) {
        case 'Drip': {
            return new Drip()
        }
        case 'UpdateDefaultDripFees': {
            return new UpdateDefaultDripFees()
        }
        case 'UpdatePythPriceFeed': {
            return new UpdatePythPriceFeed()
        }
        case 'UpdateDefaultPairDripFees': {
            return new UpdateDefaultPairDripFees()
        }
        case 'CollectFees': {
            return new CollectFees()
        }
    }
}
exports.fromJSON = fromJSON
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([], 'Drip'),
        borsh.struct([], 'UpdateDefaultDripFees'),
        borsh.struct([], 'UpdatePythPriceFeed'),
        borsh.struct([], 'UpdateDefaultPairDripFees'),
        borsh.struct([], 'CollectFees'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
exports.layout = layout
//# sourceMappingURL=AdminPermission.js.map
