import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface WithdrawFeesParamsFields {
    recipient: PublicKey
}

export interface WithdrawFeesParamsJSON {
    recipient: string
}

export class WithdrawFeesParams {
    readonly recipient: PublicKey

    constructor(fields: WithdrawFeesParamsFields) {
        this.recipient = fields.recipient
    }

    static layout(property?: string) {
        return borsh.struct([borsh.publicKey('recipient')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new WithdrawFeesParams({
            recipient: obj.recipient,
        })
    }

    static toEncodable(fields: WithdrawFeesParamsFields) {
        return {
            recipient: fields.recipient,
        }
    }

    toJSON(): WithdrawFeesParamsJSON {
        return {
            recipient: this.recipient.toString(),
        }
    }

    static fromJSON(obj: WithdrawFeesParamsJSON): WithdrawFeesParams {
        return new WithdrawFeesParams({
            recipient: new PublicKey(obj.recipient),
        })
    }

    toEncodable() {
        return WithdrawFeesParams.toEncodable(this)
    }
}
