// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface PreDripParamsFields {
    x: bigint
}

export interface PreDripParamsJSON {
    x: string
}

export class PreDripParams {
    readonly x: bigint

    constructor(fields: PreDripParamsFields) {
        this.x = fields.x
    }

    static layout(property?: string) {
        return borsh.struct([borsh.u64('x')], property)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new PreDripParams({
            x: obj.x,
        })
    }

    static toEncodable(fields: PreDripParamsFields) {
        return {
            x: new BN(fields.x.toString()),
        }
    }

    toJSON(): PreDripParamsJSON {
        return {
            x: this.x.toString(),
        }
    }

    static fromJSON(obj: PreDripParamsJSON): PreDripParams {
        return new PreDripParams({
            x: BigInt(obj.x),
        })
    }

    toEncodable() {
        return PreDripParams.toEncodable(this)
    }
}
