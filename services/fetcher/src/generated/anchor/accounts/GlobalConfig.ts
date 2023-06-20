// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey, Connection } from "@solana/web3.js"
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface GlobalConfigFields {
  version: number
  superAdmin: PublicKey
  admins: Array<PublicKey>
  adminPermissions: Array<bigint>
  defaultDripFeeBps: bigint
  globalConfigSigner: PublicKey
}

export interface GlobalConfigJSON {
  version: number
  superAdmin: string
  admins: Array<string>
  adminPermissions: Array<string>
  defaultDripFeeBps: string
  globalConfigSigner: string
}

export class GlobalConfig {
  readonly version: number
  readonly superAdmin: PublicKey
  readonly admins: Array<PublicKey>
  readonly adminPermissions: Array<bigint>
  readonly defaultDripFeeBps: bigint
  readonly globalConfigSigner: PublicKey

  static readonly discriminator = Buffer.from([
    149, 8, 156, 202, 160, 252, 176, 217,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("version"),
    borsh.publicKey("superAdmin"),
    borsh.array(borsh.publicKey(), 20, "admins"),
    borsh.array(borsh.u64(), 20, "adminPermissions"),
    borsh.u64("defaultDripFeeBps"),
    borsh.publicKey("globalConfigSigner"),
  ])

  constructor(fields: GlobalConfigFields) {
    this.version = fields.version
    this.superAdmin = fields.superAdmin
    this.admins = fields.admins
    this.adminPermissions = fields.adminPermissions
    this.defaultDripFeeBps = fields.defaultDripFeeBps
    this.globalConfigSigner = fields.globalConfigSigner
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<GlobalConfig | null> {
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
  ): Promise<Array<GlobalConfig | null>> {
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

  static decode(data: Buffer): GlobalConfig {
    if (!data.slice(0, 8).equals(GlobalConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = GlobalConfig.layout.decode(data.slice(8))

    return new GlobalConfig({
      version: dec.version,
      superAdmin: dec.superAdmin,
      admins: dec.admins,
      adminPermissions: dec.adminPermissions,
      defaultDripFeeBps: dec.defaultDripFeeBps,
      globalConfigSigner: dec.globalConfigSigner,
    })
  }

  toJSON(): GlobalConfigJSON {
    return {
      version: this.version,
      superAdmin: this.superAdmin.toString(),
      admins: this.admins.map((item) => item.toString()),
      adminPermissions: this.adminPermissions.map((item) => item.toString()),
      defaultDripFeeBps: this.defaultDripFeeBps.toString(),
      globalConfigSigner: this.globalConfigSigner.toString(),
    }
  }

  static fromJSON(obj: GlobalConfigJSON): GlobalConfig {
    return new GlobalConfig({
      version: obj.version,
      superAdmin: new PublicKey(obj.superAdmin),
      admins: obj.admins.map((item) => new PublicKey(item)),
      adminPermissions: obj.adminPermissions.map((item) => BigInt(item)),
      defaultDripFeeBps: BigInt(obj.defaultDripFeeBps),
      globalConfigSigner: new PublicKey(obj.globalConfigSigner),
    })
  }
}
