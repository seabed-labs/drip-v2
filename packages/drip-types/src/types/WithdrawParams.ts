// eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface WithdrawParamsFields {
    withdrawInputAmount: BN
    withdrawOutputAmount: BN
}

export interface WithdrawParamsJSON {
    withdrawInputAmount: string
    withdrawOutputAmount: string
}

export class WithdrawParams {
    readonly withdrawInputAmount: BN
    readonly withdrawOutputAmount: BN

    constructor(fields: WithdrawParamsFields) {
        this.withdrawInputAmount = fields.withdrawInputAmount
        this.withdrawOutputAmount = fields.withdrawOutputAmount
    }

    static layout(property?: string) {
        return borsh.struct(
            [
                borsh.u64('withdrawInputAmount'),
                borsh.u64('withdrawOutputAmount'),
            ],
            property
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new WithdrawParams({
            withdrawInputAmount: obj.withdrawInputAmount,
            withdrawOutputAmount: obj.withdrawOutputAmount,
        })
    }

    static toEncodable(fields: WithdrawParamsFields) {
        return {
            withdrawInputAmount: fields.withdrawInputAmount,
            withdrawOutputAmount: fields.withdrawOutputAmount,
        }
    }

    toJSON(): WithdrawParamsJSON {
        return {
            withdrawInputAmount: this.withdrawInputAmount.toString(),
            withdrawOutputAmount: this.withdrawOutputAmount.toString(),
        }
    }

    static fromJSON(obj: WithdrawParamsJSON): WithdrawParams {
        return new WithdrawParams({
            withdrawInputAmount: new BN(obj.withdrawInputAmount),
            withdrawOutputAmount: new BN(obj.withdrawOutputAmount),
        })
    }

    toEncodable() {
        return WithdrawParams.toEncodable(this)
    }
}
