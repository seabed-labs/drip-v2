import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DetokenizeDripPositionAccounts {
  payer: PublicKey
  owner: PublicKey
  dripPosition: PublicKey
  dripPositionSigner: PublicKey
  dripPositionNftMint: PublicKey
  dripPositionNftAccount: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
}

export function detokenizeDripPosition(
  accounts: DetokenizeDripPositionAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: false },
    { pubkey: accounts.dripPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.dripPositionSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.dripPositionNftMint, isSigner: false, isWritable: true },
    {
      pubkey: accounts.dripPositionNftAccount,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([160, 58, 139, 72, 132, 220, 131, 18])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
