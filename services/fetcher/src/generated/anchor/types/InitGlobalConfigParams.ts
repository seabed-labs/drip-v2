// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh'

export interface InitGlobalConfigParamsFields {
    superAdmin: PublicKey
    defaultDripFeeBps: bigint
}

export interface InitGlobalConfigParamsJSON {
    superAdmin: string
    defaultDripFeeBps: string
}

export class InitGlobalConfigParams {
    readonly superAdmin: PublicKey
    readonly defaultDripFeeBps: bigint

    constructor(fields: InitGlobalConfigParamsFields) {
        this.superAdmin = fields.superAdmin
        this.defaultDripFeeBps = fields.defaultDripFeeBps
    }

    static layout(property?: string) {
        return borsh.struct(
            [borsh.publicKey('superAdmin'), borsh.u64('defaultDripFeeBps')],
            property
        )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromDecoded(obj: any) {
        return new InitGlobalConfigParams({
            superAdmin: obj.superAdmin,
            defaultDripFeeBps: obj.defaultDripFeeBps,
        })
    }

    static toEncodable(fields: InitGlobalConfigParamsFields) {
        return {
            superAdmin: fields.superAdmin,
            defaultDripFeeBps: new BN(fields.defaultDripFeeBps.toString()),
        }
    }

    toJSON(): InitGlobalConfigParamsJSON {
        return {
            superAdmin: this.superAdmin.toString(),
            defaultDripFeeBps: this.defaultDripFeeBps.toString(),
        }
    }

    static fromJSON(obj: InitGlobalConfigParamsJSON): InitGlobalConfigParams {
        return new InitGlobalConfigParams({
            superAdmin: new PublicKey(obj.superAdmin),
            defaultDripFeeBps: BigInt(obj.defaultDripFeeBps),
        })
    }

    toEncodable() {
        return InitGlobalConfigParams.toEncodable(this)
    }
}
