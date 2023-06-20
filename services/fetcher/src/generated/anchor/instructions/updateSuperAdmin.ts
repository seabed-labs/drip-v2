// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateSuperAdminAccounts {
  signer: PublicKey
  newSuperAdmin: PublicKey
  globalConfig: PublicKey
}

export interface UpdateSuperAdminAccountsJSON {
  signer: string
  newSuperAdmin: string
  globalConfig: string
}

export class UpdateSuperAdmin {
  static readonly ixName = "updateSuperAdmin"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>

  constructor(
    readonly accounts: UpdateSuperAdminAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([17, 235, 69, 101, 141, 150, 237, 220])
    this.keys = [
      { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
      {
        pubkey: this.accounts.newSuperAdmin,
        isSigner: true,
        isWritable: false,
      },
      { pubkey: this.accounts.globalConfig, isSigner: false, isWritable: true },
    ]
  }

  static fromDecoded(flattenedAccounts: PublicKey[]) {
    const accounts = {
      signer: flattenedAccounts[0],
      newSuperAdmin: flattenedAccounts[1],
      globalConfig: flattenedAccounts[2],
    }
    return new UpdateSuperAdmin(accounts)
  }

  build() {
    const data = this.identifier
    const ix = new TransactionInstruction({
      keys: this.keys,
      programId: this.programId,
      data,
    })
    return ix
  }

  toAccountsJSON(): UpdateSuperAdminAccountsJSON {
    return {
      signer: this.accounts.signer.toString(),
      newSuperAdmin: this.accounts.newSuperAdmin.toString(),
      globalConfig: this.accounts.globalConfig.toString(),
    }
  }
}
