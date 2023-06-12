import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitDripPositionArgs {
  params: types.InitDripPositionParamsFields
}

export interface InitDripPositionAccounts {
  payer: PublicKey
  ownerNftHolder: PublicKey
  ownerNftMint: PublicKey
  ownerNftAccount: PublicKey
  globalConfig: PublicKey
  globalConfigSigner: PublicKey
  inputTokenMint: PublicKey
  outputTokenMint: PublicKey
  inputTokenAccount: PublicKey
  outputTokenAccount: PublicKey
  dripPosition: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
  associatedTokenProgram: PublicKey
}

export const layout = borsh.struct([
  types.InitDripPositionParams.layout("params"),
])

export function initDripPosition(
  args: InitDripPositionArgs,
  accounts: InitDripPositionAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerNftHolder, isSigner: true, isWritable: false },
    { pubkey: accounts.ownerNftMint, isSigner: true, isWritable: true },
    { pubkey: accounts.ownerNftAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
    { pubkey: accounts.globalConfigSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.inputTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.outputTokenMint, isSigner: false, isWritable: false },
    { pubkey: accounts.inputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.outputTokenAccount, isSigner: false, isWritable: true },
    { pubkey: accounts.dripPosition, isSigner: false, isWritable: true },
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
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
