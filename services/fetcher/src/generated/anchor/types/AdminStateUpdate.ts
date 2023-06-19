import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface ClearJSON {
    kind: 'Clear'
}

export class Clear {
    static readonly discriminator = 0
    static readonly kind = 'Clear'
    readonly discriminator = 0
    readonly kind = 'Clear'

    toJSON(): ClearJSON {
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

export type SetAdminAndResetPermissionsFields = [PublicKey]
export type SetAdminAndResetPermissionsValue = [PublicKey]

export interface SetAdminAndResetPermissionsJSON {
    kind: 'SetAdminAndResetPermissions'
    value: [string]
}

export class SetAdminAndResetPermissions {
    static readonly discriminator = 1
    static readonly kind = 'SetAdminAndResetPermissions'
    readonly discriminator = 1
    readonly kind = 'SetAdminAndResetPermissions'
    readonly value: SetAdminAndResetPermissionsValue

    constructor(value: SetAdminAndResetPermissionsFields) {
        this.value = [value[0]]
    }

    toJSON(): SetAdminAndResetPermissionsJSON {
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

export interface ResetPermissionsJSON {
    kind: 'ResetPermissions'
}

export class ResetPermissions {
    static readonly discriminator = 2
    static readonly kind = 'ResetPermissions'
    readonly discriminator = 2
    readonly kind = 'ResetPermissions'

    toJSON(): ResetPermissionsJSON {
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

export type AddPermissionFields = [types.AdminPermissionKind]
export type AddPermissionValue = [types.AdminPermissionKind]

export interface AddPermissionJSON {
    kind: 'AddPermission'
    value: [types.AdminPermissionJSON]
}

export class AddPermission {
    static readonly discriminator = 3
    static readonly kind = 'AddPermission'
    readonly discriminator = 3
    readonly kind = 'AddPermission'
    readonly value: AddPermissionValue

    constructor(value: AddPermissionFields) {
        this.value = [value[0]]
    }

    toJSON(): AddPermissionJSON {
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

export type RemovePermissionFields = [types.AdminPermissionKind]
export type RemovePermissionValue = [types.AdminPermissionKind]

export interface RemovePermissionJSON {
    kind: 'RemovePermission'
    value: [types.AdminPermissionJSON]
}

export class RemovePermission {
    static readonly discriminator = 4
    static readonly kind = 'RemovePermission'
    readonly discriminator = 4
    readonly kind = 'RemovePermission'
    readonly value: RemovePermissionValue

    constructor(value: RemovePermissionFields) {
        this.value = [value[0]]
    }

    toJSON(): RemovePermissionJSON {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.AdminStateUpdateKind {
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

export function fromJSON(
    obj: types.AdminStateUpdateJSON
): types.AdminStateUpdateKind {
    switch (obj.kind) {
        case 'Clear': {
            return new Clear()
        }
        case 'SetAdminAndResetPermissions': {
            return new SetAdminAndResetPermissions([
                new PublicKey(obj.value[0]),
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

export function layout(property?: string) {
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
