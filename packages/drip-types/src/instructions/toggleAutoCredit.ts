import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ToggleAutoCreditAccounts {
  signer: PublicKey
  dripPosition: PublicKey
}

export function toggleAutoCredit(
  accounts: ToggleAutoCreditAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.dripPosition, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([175, 234, 245, 131, 133, 109, 187, 74])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
