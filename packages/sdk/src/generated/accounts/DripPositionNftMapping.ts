import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DripPositionNftMappingFields {
  dripPositionNftMint: PublicKey
  dripPosition: PublicKey
}

export interface DripPositionNftMappingJSON {
  dripPositionNftMint: string
  dripPosition: string
}

export class DripPositionNftMapping {
  readonly dripPositionNftMint: PublicKey
  readonly dripPosition: PublicKey

  static readonly discriminator = Buffer.from([
    169, 140, 220, 36, 255, 38, 150, 167,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("dripPositionNftMint"),
    borsh.publicKey("dripPosition"),
  ])

  constructor(fields: DripPositionNftMappingFields) {
    this.dripPositionNftMint = fields.dripPositionNftMint
    this.dripPosition = fields.dripPosition
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<DripPositionNftMapping | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<DripPositionNftMapping | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): DripPositionNftMapping {
    if (!data.slice(0, 8).equals(DripPositionNftMapping.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = DripPositionNftMapping.layout.decode(data.slice(8))

    return new DripPositionNftMapping({
      dripPositionNftMint: dec.dripPositionNftMint,
      dripPosition: dec.dripPosition,
    })
  }

  toJSON(): DripPositionNftMappingJSON {
    return {
      dripPositionNftMint: this.dripPositionNftMint.toString(),
      dripPosition: this.dripPosition.toString(),
    }
  }

  static fromJSON(obj: DripPositionNftMappingJSON): DripPositionNftMapping {
    return new DripPositionNftMapping({
      dripPositionNftMint: new PublicKey(obj.dripPositionNftMint),
      dripPosition: new PublicKey(obj.dripPosition),
    })
  }
}
