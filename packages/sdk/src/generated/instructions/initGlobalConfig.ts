import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitGlobalConfigArgs {
  params: types.InitGlobalConfigParamsFields
}

export interface InitGlobalConfigAccounts {
  payer: PublicKey
  globalConfig: PublicKey
  globalConfigSigner: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  types.InitGlobalConfigParams.layout("params"),
])

export function initGlobalConfig(
  args: InitGlobalConfigArgs,
  accounts: InitGlobalConfigAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: true, isWritable: true },
    { pubkey: accounts.globalConfigSigner, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([140, 136, 214, 48, 87, 0, 120, 255])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitGlobalConfigParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
