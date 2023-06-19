import { PublicKey, Connection } from '@solana/web3.js'
// eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface DripPositionNftMappingFields {
    version: number
    dripPositionNftMint: PublicKey
    dripPosition: PublicKey
    bump: number
}

export interface DripPositionNftMappingJSON {
    version: number
    dripPositionNftMint: string
    dripPosition: string
    bump: number
}

export class DripPositionNftMapping {
    readonly version: number
    readonly dripPositionNftMint: PublicKey
    readonly dripPosition: PublicKey
    readonly bump: number

    static readonly discriminator = Buffer.from([
        169, 140, 220, 36, 255, 38, 150, 167,
    ])

    static readonly layout = borsh.struct([
        borsh.u8('version'),
        borsh.publicKey('dripPositionNftMint'),
        borsh.publicKey('dripPosition'),
        borsh.u8('bump'),
    ])

    constructor(fields: DripPositionNftMappingFields) {
        this.version = fields.version
        this.dripPositionNftMint = fields.dripPositionNftMint
        this.dripPosition = fields.dripPosition
        this.bump = fields.bump
    }

    static async fetch(
        c: Connection,
        address: PublicKey,
        programId: PublicKey = PROGRAM_ID
    ): Promise<DripPositionNftMapping | null> {
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
    ): Promise<Array<DripPositionNftMapping | null>> {
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

    static decode(data: Buffer): DripPositionNftMapping {
        if (!data.slice(0, 8).equals(DripPositionNftMapping.discriminator)) {
            throw new Error('invalid account discriminator')
        }

        const dec = DripPositionNftMapping.layout.decode(data.slice(8))

        return new DripPositionNftMapping({
            version: dec.version,
            dripPositionNftMint: dec.dripPositionNftMint,
            dripPosition: dec.dripPosition,
            bump: dec.bump,
        })
    }

    toJSON(): DripPositionNftMappingJSON {
        return {
            version: this.version,
            dripPositionNftMint: this.dripPositionNftMint.toString(),
            dripPosition: this.dripPosition.toString(),
            bump: this.bump,
        }
    }

    static fromJSON(obj: DripPositionNftMappingJSON): DripPositionNftMapping {
        return new DripPositionNftMapping({
            version: obj.version,
            dripPositionNftMint: new PublicKey(obj.dripPositionNftMint),
            dripPosition: new PublicKey(obj.dripPosition),
            bump: obj.bump,
        })
    }
}
