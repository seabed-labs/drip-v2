import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface CollectFeesParamsFields {
    recipient: PublicKey
}

export interface CollectFeesParamsJSON {
    recipient: string
}

export class CollectFeesParams {
    readonly recipient: PublicKey

    constructor(fields: CollectFeesParamsFields) {
        this.recipient = fields.recipient
    }

    static layout(property?: string) {
        return borsh.struct([borsh.publicKey('recipient')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new CollectFeesParams({
            recipient: obj.recipient,
        })
    }

    static toEncodable(fields: CollectFeesParamsFields) {
        return {
            recipient: fields.recipient,
        }
    }

    toJSON(): CollectFeesParamsJSON {
        return {
            recipient: this.recipient.toString(),
        }
    }

    static fromJSON(obj: CollectFeesParamsJSON): CollectFeesParams {
        return new CollectFeesParams({
            recipient: new PublicKey(obj.recipient),
        })
    }

    toEncodable() {
        return CollectFeesParams.toEncodable(this)
    }
}
