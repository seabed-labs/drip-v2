import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateAdminArgs {
  params: types.UpdateAdminParamsFields
}

export interface UpdateAdminAccounts {
  signer: PublicKey
  globalConfig: PublicKey
}

export const layout = borsh.struct([types.UpdateAdminParams.layout("params")])

export function updateAdmin(
  args: UpdateAdminArgs,
  accounts: UpdateAdminAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([161, 176, 40, 213, 60, 184, 179, 228])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.UpdateAdminParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
