// eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface UpdateDefaultPairDripFeesParamsFields {
    newDefaultPairDripFeesBps: BN
}

export interface UpdateDefaultPairDripFeesParamsJSON {
    newDefaultPairDripFeesBps: string
}

export class UpdateDefaultPairDripFeesParams {
    readonly newDefaultPairDripFeesBps: BN

    constructor(fields: UpdateDefaultPairDripFeesParamsFields) {
        this.newDefaultPairDripFeesBps = fields.newDefaultPairDripFeesBps
    }

    static layout(property?: string) {
        return borsh.struct([borsh.u64('newDefaultPairDripFeesBps')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new UpdateDefaultPairDripFeesParams({
            newDefaultPairDripFeesBps: obj.newDefaultPairDripFeesBps,
        })
    }

    static toEncodable(fields: UpdateDefaultPairDripFeesParamsFields) {
        return {
            newDefaultPairDripFeesBps: fields.newDefaultPairDripFeesBps,
        }
    }

    toJSON(): UpdateDefaultPairDripFeesParamsJSON {
        return {
            newDefaultPairDripFeesBps:
                this.newDefaultPairDripFeesBps.toString(),
        }
    }

    static fromJSON(
        obj: UpdateDefaultPairDripFeesParamsJSON
    ): UpdateDefaultPairDripFeesParams {
        return new UpdateDefaultPairDripFeesParams({
            newDefaultPairDripFeesBps: new BN(obj.newDefaultPairDripFeesBps),
        })
    }

    toEncodable() {
        return UpdateDefaultPairDripFeesParams.toEncodable(this)
    }
}
