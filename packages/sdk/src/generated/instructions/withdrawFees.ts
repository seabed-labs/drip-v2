import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface WithdrawFeesArgs {
  params: types.WithdrawFeesParamsFields
}

export interface WithdrawFeesAccounts {
  signer: PublicKey
  globalConfig: PublicKey
  globalConfigSigner: PublicKey
  feeTokenAccount: PublicKey
  recipientTokenAccount: PublicKey
  tokenProgram: PublicKey
}

export const layout = borsh.struct([types.WithdrawFeesParams.layout("params")])

export function withdrawFees(
  args: WithdrawFeesArgs,
  accounts: WithdrawFeesAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.signer, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.globalConfigSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.feeTokenAccount, isSigner: false, isWritable: false },
    {
      pubkey: accounts.recipientTokenAccount,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([198, 212, 171, 109, 144, 215, 174, 89])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.WithdrawFeesParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
