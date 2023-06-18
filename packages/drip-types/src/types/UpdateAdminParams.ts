// eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface UpdateAdminParamsFields {
    adminIndex: BN
    adminChange: types.AdminStateUpdateKind
}

export interface UpdateAdminParamsJSON {
    adminIndex: string
    adminChange: types.AdminStateUpdateJSON
}

export class UpdateAdminParams {
    readonly adminIndex: BN
    readonly adminChange: types.AdminStateUpdateKind

    constructor(fields: UpdateAdminParamsFields) {
        this.adminIndex = fields.adminIndex
        this.adminChange = fields.adminChange
    }

    static layout(property?: string) {
        return borsh.struct(
            [
                borsh.u64('adminIndex'),
                types.AdminStateUpdate.layout('adminChange'),
            ],
            property
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new UpdateAdminParams({
            adminIndex: obj.adminIndex,
            adminChange: types.AdminStateUpdate.fromDecoded(obj.adminChange),
        })
    }

    static toEncodable(fields: UpdateAdminParamsFields) {
        return {
            adminIndex: fields.adminIndex,
            adminChange: fields.adminChange.toEncodable(),
        }
    }

    toJSON(): UpdateAdminParamsJSON {
        return {
            adminIndex: this.adminIndex.toString(),
            adminChange: this.adminChange.toJSON(),
        }
    }

    static fromJSON(obj: UpdateAdminParamsJSON): UpdateAdminParams {
        return new UpdateAdminParams({
            adminIndex: new BN(obj.adminIndex),
            adminChange: types.AdminStateUpdate.fromJSON(obj.adminChange),
        })
    }

    toEncodable() {
        return UpdateAdminParams.toEncodable(this)
    }
}