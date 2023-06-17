import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitDripPositionArgs {
  params: types.InitDripPositionParamsFields
}

export interface InitDripPositionAccounts {
  payer: PublicKey
  owner: PublicKey
  globalConfig: PublicKey
  inputTokenMint: PublicKey
  outputTokenMint: PublicKey
  inputTokenAccount: PublicKey
  outputTokenAccount: PublicKey
  dripPosition: PublicKey
  dripPositionSigner: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([
  types.InitDripPositionParams.layout("params"),
])

export function initDripPosition(
  args: InitDripPositionArgs,
  accounts: InitDripPositionAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.inputTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.outputTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.outputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.dripPosition, isSigner: true, isWritable: true },
    { pubkey: accounts.dripPositionSigner, isSigner: false, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
    {
      pubkey: accounts.associatedTokenProgram,
      isSigner: false,
      isWritable: false,
    },
  ]
  const identifier = Buffer.from([73, 22, 223, 127, 21, 114, 122, 57])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      params: types.InitDripPositionParams.toEncodable(args.params),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
