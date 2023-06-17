import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitGlobalConfigParamsFields {
  superAdmin: PublicKey
  defaultDripFeeBps: BN
}

export interface InitGlobalConfigParamsJSON {
  superAdmin: string
  defaultDripFeeBps: string
}

export class InitGlobalConfigParams {
  readonly superAdmin: PublicKey
  readonly defaultDripFeeBps: BN

  constructor(fields: InitGlobalConfigParamsFields) {
    this.superAdmin = fields.superAdmin
    this.defaultDripFeeBps = fields.defaultDripFeeBps
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.publicKey("superAdmin"), borsh.u64("defaultDripFeeBps")],
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
      defaultDripFeeBps: fields.defaultDripFeeBps,
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
      defaultDripFeeBps: new BN(obj.defaultDripFeeBps),
    })
  }

  toEncodable() {
    return InitGlobalConfigParams.toEncodable(this)
  }
}
