import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateSuperAdminAccounts {
  signer: PublicKey
  newSuperAdmin: PublicKey
  globalConfig: PublicKey
}

export function updateSuperAdmin(accounts: UpdateSuperAdminAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.newSuperAdmin, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([17, 235, 69, 101, 141, 150, 237, 220])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
