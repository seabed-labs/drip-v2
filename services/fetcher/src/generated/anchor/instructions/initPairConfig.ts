// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface InitPairConfigAccounts {
  payer: PublicKey
  globalConfig: PublicKey
  inputTokenMint: PublicKey
  outputTokenMint: PublicKey
  pairConfig: PublicKey
  systemProgram: PublicKey
}

export interface InitPairConfigAccountsJSON {
  payer: string
  globalConfig: string
  inputTokenMint: string
  outputTokenMint: string
  pairConfig: string
  systemProgram: string
}

export class InitPairConfig {
  static readonly ixName = "initPairConfig"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>

  constructor(
    readonly accounts: InitPairConfigAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([205, 58, 197, 248, 181, 39, 56, 152])
    this.keys = [
      { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
      {
        pubkey: this.accounts.globalConfig,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.inputTokenMint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.outputTokenMint,
        isSigner: false,
        isWritable: false,
      },
      { pubkey: this.accounts.pairConfig, isSigner: false, isWritable: true },
      {
        pubkey: this.accounts.systemProgram,
        isSigner: false,
        isWritable: false,
      },
    ]
  }

  static fromDecoded(flattenedAccounts: PublicKey[]) {
    const accounts = {
      payer: flattenedAccounts[0],
      globalConfig: flattenedAccounts[1],
      inputTokenMint: flattenedAccounts[2],
      outputTokenMint: flattenedAccounts[3],
      pairConfig: flattenedAccounts[4],
      systemProgram: flattenedAccounts[5],
    }
    return new InitPairConfig(accounts)
  }

  build() {
    const data = this.identifier
    const ix = new TransactionInstruction({
      keys: this.keys,
      programId: this.programId,
      data,
    })
    return ix
  }

  toAccountsJSON(): InitPairConfigAccountsJSON {
    return {
      payer: this.accounts.payer.toString(),
      globalConfig: this.accounts.globalConfig.toString(),
      inputTokenMint: this.accounts.inputTokenMint.toString(),
      outputTokenMint: this.accounts.outputTokenMint.toString(),
      pairConfig: this.accounts.pairConfig.toString(),
      systemProgram: this.accounts.systemProgram.toString(),
    }
  }
}
