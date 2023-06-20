// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
// WithdrawFields are raw anchor decoded values
export interface WithdrawFields {
  params: types.WithdrawParamsFields
}
// WithdrawArgs convert properties to type classes if available. This is used for converting to JSON
export interface WithdrawArgs {
  params: types.WithdrawParams
}

export interface WithdrawFieldsJSON {
  params: types.WithdrawParamsJSON
}

export interface WithdrawAccounts {
  signer: PublicKey
  destinationInputTokenAccount: PublicKey
  destinationOutputTokenAccount: PublicKey
  dripPositionInputTokenAccount: PublicKey
  dripPositionOutputTokenAccount: PublicKey
  dripPositionNftMint: PublicKey
  dripPositionNftAccount: PublicKey
  dripPosition: PublicKey
  dripPositionSigner: PublicKey
  tokenProgram: PublicKey
}

export interface WithdrawAccountsJSON {
  signer: string
  destinationInputTokenAccount: string
  destinationOutputTokenAccount: string
  dripPositionInputTokenAccount: string
  dripPositionOutputTokenAccount: string
  dripPositionNftMint: string
  dripPositionNftAccount: string
  dripPosition: string
  dripPositionSigner: string
  tokenProgram: string
}

const layout = borsh.struct([types.WithdrawParams.layout("params")])

export class Withdraw {
  static readonly ixName = "withdraw"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>
  readonly args: WithdrawArgs

  constructor(
    readonly fields: WithdrawFields,
    readonly accounts: WithdrawAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([183, 18, 70, 156, 148, 109, 161, 34])
    this.keys = [
      { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
      {
        pubkey: this.accounts.destinationInputTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.destinationOutputTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.dripPositionInputTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.dripPositionOutputTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.dripPositionNftMint,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.dripPositionNftAccount,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.dripPosition,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.dripPositionSigner,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.tokenProgram,
        isSigner: false,
        isWritable: false,
      },
    ]
    this.args = {
      params: new types.WithdrawParams({ ...fields.params }),
    }
  }

  static fromDecoded(fields: WithdrawFields, flattenedAccounts: PublicKey[]) {
    const accounts = {
      signer: flattenedAccounts[0],
      destinationInputTokenAccount: flattenedAccounts[1],
      destinationOutputTokenAccount: flattenedAccounts[2],
      dripPositionInputTokenAccount: flattenedAccounts[3],
      dripPositionOutputTokenAccount: flattenedAccounts[4],
      dripPositionNftMint: flattenedAccounts[5],
      dripPositionNftAccount: flattenedAccounts[6],
      dripPosition: flattenedAccounts[7],
      dripPositionSigner: flattenedAccounts[8],
      tokenProgram: flattenedAccounts[9],
    }
    return new Withdraw(fields, accounts)
  }

  build() {
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
      {
        params: types.WithdrawParams.toEncodable(this.fields.params),
      },
      buffer
    )
    const data = Buffer.concat([this.identifier, buffer]).slice(0, 8 + len)
    const ix = new TransactionInstruction({
      keys: this.keys,
      programId: this.programId,
      data,
    })
    return ix
  }

  toArgsJSON(): WithdrawFieldsJSON {
    return {
      params: this.args.params.toJSON(),
    }
  }

  toAccountsJSON(): WithdrawAccountsJSON {
    return {
      signer: this.accounts.signer.toString(),
      destinationInputTokenAccount:
        this.accounts.destinationInputTokenAccount.toString(),
      destinationOutputTokenAccount:
        this.accounts.destinationOutputTokenAccount.toString(),
      dripPositionInputTokenAccount:
        this.accounts.dripPositionInputTokenAccount.toString(),
      dripPositionOutputTokenAccount:
        this.accounts.dripPositionOutputTokenAccount.toString(),
      dripPositionNftMint: this.accounts.dripPositionNftMint.toString(),
      dripPositionNftAccount: this.accounts.dripPositionNftAccount.toString(),
      dripPosition: this.accounts.dripPosition.toString(),
      dripPositionSigner: this.accounts.dripPositionSigner.toString(),
      tokenProgram: this.accounts.tokenProgram.toString(),
    }
  }
}
