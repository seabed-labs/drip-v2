import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateSuperAdminArgs {
  params: types.UpdateSuperAdminParamsFields
}

export interface UpdateSuperAdminAccounts {
  signer: PublicKey
  globalConfig: PublicKey
}

export const layout = borsh.struct([
  types.UpdateSuperAdminParams.layout("params"),
])

export function updateSuperAdmin(
  args: UpdateSuperAdminArgs,
  accounts: UpdateSuperAdminAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([17, 235, 69, 101, 141, 150, 237, 220])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.UpdateSuperAdminParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
