import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface FeeCollectorFields {
  version: number
  globalConfig: PublicKey
  bump: number
}

export interface FeeCollectorJSON {
  version: number
  globalConfig: string
  bump: number
}

export class FeeCollector {
  readonly version: number
  readonly globalConfig: PublicKey
  readonly bump: number

  static readonly discriminator = Buffer.from([
    250, 213, 73, 200, 175, 76, 225, 213,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("version"),
    borsh.publicKey("globalConfig"),
    borsh.u8("bump"),
  ])

  constructor(fields: FeeCollectorFields) {
    this.version = fields.version
    this.globalConfig = fields.globalConfig
    this.bump = fields.bump
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<FeeCollector | null> {
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
  ): Promise<Array<FeeCollector | null>> {
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

  static decode(data: Buffer): FeeCollector {
    if (!data.slice(0, 8).equals(FeeCollector.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = FeeCollector.layout.decode(data.slice(8))

    return new FeeCollector({
      version: dec.version,
      globalConfig: dec.globalConfig,
      bump: dec.bump,
    })
  }

  toJSON(): FeeCollectorJSON {
    return {
      version: this.version,
      globalConfig: this.globalConfig.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: FeeCollectorJSON): FeeCollector {
    return new FeeCollector({
      version: obj.version,
      globalConfig: new PublicKey(obj.globalConfig),
      bump: obj.bump,
    })
  }
}
