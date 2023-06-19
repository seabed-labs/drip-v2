// eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface DepositParamsFields {
    depositAmount: BN
}

export interface DepositParamsJSON {
    depositAmount: string
}

export class DepositParams {
    readonly depositAmount: BN

    constructor(fields: DepositParamsFields) {
        this.depositAmount = fields.depositAmount
    }

    static layout(property?: string) {
        return borsh.struct([borsh.u64('depositAmount')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new DepositParams({
            depositAmount: obj.depositAmount,
        })
    }

    static toEncodable(fields: DepositParamsFields) {
        return {
            depositAmount: fields.depositAmount,
        }
    }

    toJSON(): DepositParamsJSON {
        return {
            depositAmount: this.depositAmount.toString(),
        }
    }

    static fromJSON(obj: DepositParamsJSON): DepositParams {
        return new DepositParams({
            depositAmount: new BN(obj.depositAmount),
        })
    }

    toEncodable() {
        return DepositParams.toEncodable(this)
    }
}
