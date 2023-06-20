// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh"

export interface DepositParamsFields {
  depositAmount: bigint
}

export interface DepositParamsJSON {
  depositAmount: string
}

export class DepositParams {
  readonly depositAmount: bigint

  constructor(fields: DepositParamsFields) {
    this.depositAmount = fields.depositAmount
  }

  static layout(property?: string) {
    return borsh.struct([borsh.u64("depositAmount")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new DepositParams({
      depositAmount: obj.depositAmount,
    })
  }

  static toEncodable(fields: DepositParamsFields) {
    return {
      depositAmount: new BN(fields.depositAmount.toString()),
    }
  }

  toJSON(): DepositParamsJSON {
    return {
      depositAmount: this.depositAmount.toString(),
    }
  }

  static fromJSON(obj: DepositParamsJSON): DepositParams {
    return new DepositParams({
      depositAmount: BigInt(obj.depositAmount),
    })
  }

  toEncodable() {
    return DepositParams.toEncodable(this)
  }
}
