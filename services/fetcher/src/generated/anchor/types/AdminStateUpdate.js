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
    exports.RemovePermission =
    exports.AddPermission =
    exports.ResetPermissions =
    exports.SetAdminAndResetPermissions =
    exports.Clear =
        void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js') // eslint-disable-line @typescript-eslint/no-unused-vars
const types = __importStar(require('../types')) // eslint-disable-line @typescript-eslint/no-unused-vars
const borsh = __importStar(require('@coral-xyz/borsh'))
class Clear {
    constructor() {
        this.discriminator = 0
        this.kind = 'Clear'
    }
    toJSON() {
        return {
            kind: 'Clear',
        }
    }
    toEncodable() {
        return {
            Clear: {},
        }
    }
}
exports.Clear = Clear
Clear.discriminator = 0
Clear.kind = 'Clear'
class SetAdminAndResetPermissions {
    constructor(value) {
        this.discriminator = 1
        this.kind = 'SetAdminAndResetPermissions'
        this.value = [value[0]]
    }
    toJSON() {
        return {
            kind: 'SetAdminAndResetPermissions',
            value: [this.value[0].toString()],
        }
    }
    toEncodable() {
        return {
            SetAdminAndResetPermissions: {
                _0: this.value[0],
            },
        }
    }
}
exports.SetAdminAndResetPermissions = SetAdminAndResetPermissions
SetAdminAndResetPermissions.discriminator = 1
SetAdminAndResetPermissions.kind = 'SetAdminAndResetPermissions'
class ResetPermissions {
    constructor() {
        this.discriminator = 2
        this.kind = 'ResetPermissions'
    }
    toJSON() {
        return {
            kind: 'ResetPermissions',
        }
    }
    toEncodable() {
        return {
            ResetPermissions: {},
        }
    }
}
exports.ResetPermissions = ResetPermissions
ResetPermissions.discriminator = 2
ResetPermissions.kind = 'ResetPermissions'
class AddPermission {
    constructor(value) {
        this.discriminator = 3
        this.kind = 'AddPermission'
        this.value = [value[0]]
    }
    toJSON() {
        return {
            kind: 'AddPermission',
            value: [this.value[0].toJSON()],
        }
    }
    toEncodable() {
        return {
            AddPermission: {
                _0: this.value[0].toEncodable(),
            },
        }
    }
}
exports.AddPermission = AddPermission
AddPermission.discriminator = 3
AddPermission.kind = 'AddPermission'
class RemovePermission {
    constructor(value) {
        this.discriminator = 4
        this.kind = 'RemovePermission'
        this.value = [value[0]]
    }
    toJSON() {
        return {
            kind: 'RemovePermission',
            value: [this.value[0].toJSON()],
        }
    }
    toEncodable() {
        return {
            RemovePermission: {
                _0: this.value[0].toEncodable(),
            },
        }
    }
}
exports.RemovePermission = RemovePermission
RemovePermission.discriminator = 4
RemovePermission.kind = 'RemovePermission'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fromDecoded(obj) {
    if (typeof obj !== 'object') {
        throw new Error('Invalid enum object')
    }
    if ('Clear' in obj) {
        return new Clear()
    }
    if ('SetAdminAndResetPermissions' in obj) {
        const val = obj['SetAdminAndResetPermissions']
        return new SetAdminAndResetPermissions([val['_0']])
    }
    if ('ResetPermissions' in obj) {
        return new ResetPermissions()
    }
    if ('AddPermission' in obj) {
        const val = obj['AddPermission']
        return new AddPermission([types.AdminPermission.fromDecoded(val['_0'])])
    }
    if ('RemovePermission' in obj) {
        const val = obj['RemovePermission']
        return new RemovePermission([
            types.AdminPermission.fromDecoded(val['_0']),
        ])
    }
    throw new Error('Invalid enum object')
}
exports.fromDecoded = fromDecoded
function fromJSON(obj) {
    switch (obj.kind) {
        case 'Clear': {
            return new Clear()
        }
        case 'SetAdminAndResetPermissions': {
            return new SetAdminAndResetPermissions([
                new web3_js_1.PublicKey(obj.value[0]),
            ])
        }
        case 'ResetPermissions': {
            return new ResetPermissions()
        }
        case 'AddPermission': {
            return new AddPermission([
                types.AdminPermission.fromJSON(obj.value[0]),
            ])
        }
        case 'RemovePermission': {
            return new RemovePermission([
                types.AdminPermission.fromJSON(obj.value[0]),
            ])
        }
    }
}
exports.fromJSON = fromJSON
function layout(property) {
    const ret = borsh.rustEnum([
        borsh.struct([], 'Clear'),
        borsh.struct([borsh.publicKey('_0')], 'SetAdminAndResetPermissions'),
        borsh.struct([], 'ResetPermissions'),
        borsh.struct([types.AdminPermission.layout('_0')], 'AddPermission'),
        borsh.struct([types.AdminPermission.layout('_0')], 'RemovePermission'),
    ])
    if (property !== undefined) {
        return ret.replicate(property)
    }
    return ret
}
exports.layout = layout
//# sourceMappingURL=AdminStateUpdate.js.map
