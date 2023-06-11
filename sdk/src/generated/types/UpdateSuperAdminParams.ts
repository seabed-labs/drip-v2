import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface UpdateSuperAdminParamsFields {
  newSuperAdmin: PublicKey
}

export interface UpdateSuperAdminParamsJSON {
  newSuperAdmin: string
}

export class UpdateSuperAdminParams {
  readonly newSuperAdmin: PublicKey

  constructor(fields: UpdateSuperAdminParamsFields) {
    this.newSuperAdmin = fields.newSuperAdmin
  }

  static layout(property?: string) {
    return borsh.struct([borsh.publicKey("newSuperAdmin")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new UpdateSuperAdminParams({
      newSuperAdmin: obj.newSuperAdmin,
    })
  }

  static toEncodable(fields: UpdateSuperAdminParamsFields) {
    return {
      newSuperAdmin: fields.newSuperAdmin,
    }
  }

  toJSON(): UpdateSuperAdminParamsJSON {
    return {
      newSuperAdmin: this.newSuperAdmin.toString(),
    }
  }

  static fromJSON(obj: UpdateSuperAdminParamsJSON): UpdateSuperAdminParams {
    return new UpdateSuperAdminParams({
      newSuperAdmin: new PublicKey(obj.newSuperAdmin),
    })
  }

  toEncodable() {
    return UpdateSuperAdminParams.toEncodable(this)
  }
}
