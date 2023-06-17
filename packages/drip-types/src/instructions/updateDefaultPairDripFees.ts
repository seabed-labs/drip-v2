import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface UpdateDefaultPairDripFeesArgs {
  params: types.UpdateDefaultPairDripFeesParamsFields
}

export interface UpdateDefaultPairDripFeesAccounts {
  signer: PublicKey
  pairConfig: PublicKey
  globalConfig: PublicKey
}

export const layout = borsh.struct([
  types.UpdateDefaultPairDripFeesParams.layout("params"),
])

export function updateDefaultPairDripFees(
  args: UpdateDefaultPairDripFeesArgs,
  accounts: UpdateDefaultPairDripFeesAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.pairConfig, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([213, 197, 141, 244, 167, 253, 130, 190])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.UpdateDefaultPairDripFeesParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
