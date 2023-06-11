import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UpdateDefaultDripFeesParamsFields {
  newDefaultDripFeesBps: BN
}

export interface UpdateDefaultDripFeesParamsJSON {
  newDefaultDripFeesBps: string
}

export class UpdateDefaultDripFeesParams {
  readonly newDefaultDripFeesBps: BN

  constructor(fields: UpdateDefaultDripFeesParamsFields) {
    this.newDefaultDripFeesBps = fields.newDefaultDripFeesBps
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("newDefaultDripFeesBps")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new UpdateDefaultDripFeesParams({
      newDefaultDripFeesBps: obj.newDefaultDripFeesBps,
    })
  }

  static toEncodable(fields: UpdateDefaultDripFeesParamsFields) {
    return {
      newDefaultDripFeesBps: fields.newDefaultDripFeesBps,
    }
  }

  toJSON(): UpdateDefaultDripFeesParamsJSON {
    return {
      newDefaultDripFeesBps: this.newDefaultDripFeesBps.toString(),
    }
  }

  static fromJSON(
    obj: UpdateDefaultDripFeesParamsJSON
  ): UpdateDefaultDripFeesParams {
    return new UpdateDefaultDripFeesParams({
      newDefaultDripFeesBps: new BN(obj.newDefaultDripFeesBps),
    })
  }

  toEncodable() {
    return UpdateDefaultDripFeesParams.toEncodable(this)
  }
}
