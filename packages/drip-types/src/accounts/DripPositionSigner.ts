import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DripPositionSignerFields {
  dripPosition: PublicKey
  bump: number
}

export interface DripPositionSignerJSON {
  dripPosition: string
  bump: number
}

export class DripPositionSigner {
  readonly dripPosition: PublicKey
  readonly bump: number

  static readonly discriminator = Buffer.from([
    46, 148, 91, 27, 20, 159, 253, 99,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("dripPosition"),
    borsh.u8("bump"),
  ])

  constructor(fields: DripPositionSignerFields) {
    this.dripPosition = fields.dripPosition
    this.bump = fields.bump
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<DripPositionSigner | null> {
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
  ): Promise<Array<DripPositionSigner | null>> {
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

  static decode(data: Buffer): DripPositionSigner {
    if (!data.slice(0, 8).equals(DripPositionSigner.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = DripPositionSigner.layout.decode(data.slice(8))

    return new DripPositionSigner({
      dripPosition: dec.dripPosition,
      bump: dec.bump,
    })
  }

  toJSON(): DripPositionSignerJSON {
    return {
      dripPosition: this.dripPosition.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: DripPositionSignerJSON): DripPositionSigner {
    return new DripPositionSigner({
      dripPosition: new PublicKey(obj.dripPosition),
      bump: obj.bump,
    })
  }
}
