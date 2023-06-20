// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface InitDripPositionParamsFields {
    dripAmount: bigint
    frequencyInSeconds: bigint
}

export interface InitDripPositionParamsJSON {
    dripAmount: string
    frequencyInSeconds: string
}

export class InitDripPositionParams {
    readonly dripAmount: bigint
    readonly frequencyInSeconds: bigint

    constructor(fields: InitDripPositionParamsFields) {
        this.dripAmount = fields.dripAmount
        this.frequencyInSeconds = fields.frequencyInSeconds
    }

    static layout(property?: string) {
        return borsh.struct(
            [borsh.u64('dripAmount'), borsh.u64('frequencyInSeconds')],
            property
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new InitDripPositionParams({
            dripAmount: obj.dripAmount,
            frequencyInSeconds: obj.frequencyInSeconds,
        })
    }

    static toEncodable(fields: InitDripPositionParamsFields) {
        return {
            dripAmount: new BN(fields.dripAmount.toString()),
            frequencyInSeconds: new BN(fields.frequencyInSeconds.toString()),
        }
    }

    toJSON(): InitDripPositionParamsJSON {
        return {
            dripAmount: this.dripAmount.toString(),
            frequencyInSeconds: this.frequencyInSeconds.toString(),
        }
    }

    static fromJSON(obj: InitDripPositionParamsJSON): InitDripPositionParams {
        return new InitDripPositionParams({
            dripAmount: BigInt(obj.dripAmount),
            frequencyInSeconds: BigInt(obj.frequencyInSeconds),
        })
    }

    toEncodable() {
        return InitDripPositionParams.toEncodable(this)
    }
}
