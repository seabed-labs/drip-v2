import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateDefaultDripFeesArgs {
  params: types.UpdateDefaultDripFeesParamsFields
}

export interface UpdateDefaultDripFeesAccounts {
  signer: PublicKey
  globalConfig: PublicKey
}

export const layout = borsh.struct([
  types.UpdateDefaultDripFeesParams.layout("params"),
])

export function updateDefaultDripFees(
  args: UpdateDefaultDripFeesArgs,
  accounts: UpdateDefaultDripFeesAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: true },
  ]
  const identifier = Buffer.from([45, 99, 218, 191, 20, 128, 35, 142])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.UpdateDefaultDripFeesParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
