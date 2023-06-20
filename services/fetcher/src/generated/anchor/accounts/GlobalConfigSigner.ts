// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey, Connection } from '@solana/web3.js'
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface GlobalConfigSignerFields {
    version: number
    globalConfig: PublicKey
    bump: number
}

export interface GlobalConfigSignerJSON {
    version: number
    globalConfig: string
    bump: number
}

export class GlobalConfigSigner {
    readonly version: number
    readonly globalConfig: PublicKey
    readonly bump: number

    static readonly discriminator = Buffer.from([
        212, 5, 167, 35, 164, 254, 222, 168,
    ])

    static readonly layout = borsh.struct([
        borsh.u8('version'),
        borsh.publicKey('globalConfig'),
        borsh.u8('bump'),
    ])

    constructor(fields: GlobalConfigSignerFields) {
        this.version = fields.version
        this.globalConfig = fields.globalConfig
        this.bump = fields.bump
    }

    static async fetch(
        c: Connection,
        address: PublicKey,
        programId: PublicKey = PROGRAM_ID
    ): Promise<GlobalConfigSigner | null> {
        const info = await c.getAccountInfo(address)

        if (info === null) {
            return null
        }
        if (!info.owner.equals(programId)) {
            throw new Error("account doesn't belong to this program")
        }

        return this.decode(info.data)
    }

    static async fetchMultiple(
        c: Connection,
        addresses: PublicKey[],
        programId: PublicKey = PROGRAM_ID
    ): Promise<Array<GlobalConfigSigner | null>> {
        const infos = await c.getMultipleAccountsInfo(addresses)

        return infos.map((info) => {
            if (info === null) {
                return null
            }
            if (!info.owner.equals(programId)) {
                throw new Error("account doesn't belong to this program")
            }

            return this.decode(info.data)
        })
    }

    static decode(data: Buffer): GlobalConfigSigner {
        if (!data.slice(0, 8).equals(GlobalConfigSigner.discriminator)) {
            throw new Error('invalid account discriminator')
        }

        const dec = GlobalConfigSigner.layout.decode(data.slice(8))

        return new GlobalConfigSigner({
            version: dec.version,
            globalConfig: dec.globalConfig,
            bump: dec.bump,
        })
    }

    toJSON(): GlobalConfigSignerJSON {
        return {
            version: this.version,
            globalConfig: this.globalConfig.toString(),
            bump: this.bump,
        }
    }

    static fromJSON(obj: GlobalConfigSignerJSON): GlobalConfigSigner {
        return new GlobalConfigSigner({
            version: obj.version,
            globalConfig: new PublicKey(obj.globalConfig),
            bump: obj.bump,
        })
    }
}
