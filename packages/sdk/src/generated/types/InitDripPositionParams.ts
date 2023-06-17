import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InitDripPositionParamsFields {
  dripAmount: BN
  frequencyInSeconds: BN
}

export interface InitDripPositionParamsJSON {
  dripAmount: string
  frequencyInSeconds: string
}

export class InitDripPositionParams {
  readonly dripAmount: BN
  readonly frequencyInSeconds: BN

  constructor(fields: InitDripPositionParamsFields) {
    this.dripAmount = fields.dripAmount
    this.frequencyInSeconds = fields.frequencyInSeconds
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u64("dripAmount"), borsh.u64("frequencyInSeconds")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new InitDripPositionParams({
      dripAmount: obj.dripAmount,
      frequencyInSeconds: obj.frequencyInSeconds,
    })
  }

  static toEncodable(fields: InitDripPositionParamsFields) {
    return {
      dripAmount: fields.dripAmount,
      frequencyInSeconds: fields.frequencyInSeconds,
    }
  }

  toJSON(): InitDripPositionParamsJSON {
    return {
      dripAmount: this.dripAmount.toString(),
      frequencyInSeconds: this.frequencyInSeconds.toString(),
    }
  }

  static fromJSON(obj: InitDripPositionParamsJSON): InitDripPositionParams {
    return new InitDripPositionParams({
      dripAmount: new BN(obj.dripAmount),
      frequencyInSeconds: new BN(obj.frequencyInSeconds),
    })
  }

  toEncodable() {
    return InitDripPositionParams.toEncodable(this)
  }
}
