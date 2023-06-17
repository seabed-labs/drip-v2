import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitDripPositionNftAccounts {
  payer: PublicKey
  dripPosition: PublicKey
  dripPositionSigner: PublicKey
  dripPositionNftMint: PublicKey
  dripPositionNftMapping: PublicKey
  systemProgram: PublicKey
  tokenProgram: PublicKey
}

export function initDripPositionNft(
  accounts: InitDripPositionNftAccounts,
  programId: PublicKey = PROGRAM_ID
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.payer, isSigner: true, isWritable: true },
    { pubkey: accounts.dripPosition, isSigner: false, isWritable: true },
    { pubkey: accounts.dripPositionSigner, isSigner: false, isWritable: false },
    { pubkey: accounts.dripPositionNftMint, isSigner: true, isWritable: true },
    {
      pubkey: accounts.dripPositionNftMapping,
      isSigner: false,
      isWritable: true,
    },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([143, 9, 195, 8, 246, 10, 71, 31])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId, data })
  return ix
}
