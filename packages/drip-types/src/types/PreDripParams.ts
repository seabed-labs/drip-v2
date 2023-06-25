// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface PreDripParamsFields {
  dripAmountToFill: bigint
}

export interface PreDripParamsJSON {
  dripAmountToFill: string
}

export class PreDripParams {
  readonly dripAmountToFill: bigint

  constructor(fields: PreDripParamsFields) {
    this.dripAmountToFill = fields.dripAmountToFill
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("dripAmountToFill")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new PreDripParams({
      dripAmountToFill: obj.dripAmountToFill,
    })
  }

  static toEncodable(fields: PreDripParamsFields) {
    return {
      dripAmountToFill: new BN(fields.dripAmountToFill.toString()),
    }
  }

  toJSON(): PreDripParamsJSON {
    return {
      dripAmountToFill: this.dripAmountToFill.toString(),
    }
  }

  static fromJSON(obj: PreDripParamsJSON): PreDripParams {
    return new PreDripParams({
      dripAmountToFill: BigInt(obj.dripAmountToFill),
    })
  }

  toEncodable() {
    return PreDripParams.toEncodable(this)
  }
}
