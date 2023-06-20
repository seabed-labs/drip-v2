// This file was automatically generated. DO NOT MODIFY DIRECTLY.
// eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface UpdateDefaultDripFeesParamsFields {
    newDefaultDripFeesBps: bigint
}

export interface UpdateDefaultDripFeesParamsJSON {
    newDefaultDripFeesBps: string
}

export class UpdateDefaultDripFeesParams {
    readonly newDefaultDripFeesBps: bigint

    constructor(fields: UpdateDefaultDripFeesParamsFields) {
        this.newDefaultDripFeesBps = fields.newDefaultDripFeesBps
    }

    static layout(property?: string) {
        return borsh.struct([borsh.u64('newDefaultDripFeesBps')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new UpdateDefaultDripFeesParams({
            newDefaultDripFeesBps: obj.newDefaultDripFeesBps,
        })
    }

    static toEncodable(fields: UpdateDefaultDripFeesParamsFields) {
        return {
            newDefaultDripFeesBps: new BN(
                fields.newDefaultDripFeesBps.toString()
            ),
        }
    }

    toJSON(): UpdateDefaultDripFeesParamsJSON {
        return {
            newDefaultDripFeesBps: this.newDefaultDripFeesBps.toString(),
        }
    }

    static fromJSON(
        obj: UpdateDefaultDripFeesParamsJSON
    ): UpdateDefaultDripFeesParams {
        return new UpdateDefaultDripFeesParams({
            newDefaultDripFeesBps: BigInt(obj.newDefaultDripFeesBps),
        })
    }

    toEncodable() {
        return UpdateDefaultDripFeesParams.toEncodable(this)
    }
}
