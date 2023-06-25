// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
// PreDripFields are raw anchor decoded values
export interface PreDripFields {
  params: types.PreDripParamsFields
}
// PreDripArgs convert properties to type classes if available. This is used for converting to JSON
export interface PreDripArgs {
  params: types.PreDripParams
}

export interface PreDripFieldsJSON {
  params: types.PreDripParamsJSON
}

export interface PreDripAccounts {
  signer: PublicKey
  globalConfig: PublicKey
  inputTokenFeeAccount: PublicKey
  pairConfig: PublicKey
  dripPosition: PublicKey
  dripPositionSigner: PublicKey
  dripPositionInputTokenAccount: PublicKey
  dripPositionOutputTokenAccount: PublicKey
  dripperInputTokenAccount: PublicKey
  instructions: PublicKey
  tokenProgram: PublicKey
}

export interface PreDripAccountsJSON {
  signer: string
  globalConfig: string
  inputTokenFeeAccount: string
  pairConfig: string
  dripPosition: string
  dripPositionSigner: string
  dripPositionInputTokenAccount: string
  dripPositionOutputTokenAccount: string
  dripperInputTokenAccount: string
  instructions: string
  tokenProgram: string
}

const layout = borsh.struct([types.PreDripParams.layout("params")])

export class PreDrip {
  static readonly ixName = "preDrip"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>
  readonly args: PreDripArgs

  constructor(
    readonly fields: PreDripFields,
    readonly accounts: PreDripAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([34, 16, 105, 194, 1, 128, 80, 115])
    this.keys = [
      { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
      {
        pubkey: this.accounts.globalConfig,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: this.accounts.inputTokenFeeAccount,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: this.accounts.pairConfig, isSigner: false, isWritable: false },
      { pubkey: this.accounts.dripPosition, isSigner: false, isWritable: true },
      {
        pubkey: this.accounts.dripPositionSigner,
        isSigner: false,
        isWritable: false,
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
        pubkey: this.accounts.dripperInputTokenAccount,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.instructions,
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
      params: new types.PreDripParams({ ...fields.params }),
    }
  }

  static fromDecoded(fields: PreDripFields, flattenedAccounts: PublicKey[]) {
    const accounts = {
      signer: flattenedAccounts[0],
      globalConfig: flattenedAccounts[1],
      inputTokenFeeAccount: flattenedAccounts[2],
      pairConfig: flattenedAccounts[3],
      dripPosition: flattenedAccounts[4],
      dripPositionSigner: flattenedAccounts[5],
      dripPositionInputTokenAccount: flattenedAccounts[6],
      dripPositionOutputTokenAccount: flattenedAccounts[7],
      dripperInputTokenAccount: flattenedAccounts[8],
      instructions: flattenedAccounts[9],
      tokenProgram: flattenedAccounts[10],
    }
    return new PreDrip(fields, accounts)
  }

  build() {
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
      {
        params: types.PreDripParams.toEncodable(this.fields.params),
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

  toArgsJSON(): PreDripFieldsJSON {
    return {
      params: this.args.params.toJSON(),
    }
  }

  toAccountsJSON(): PreDripAccountsJSON {
    return {
      signer: this.accounts.signer.toString(),
      globalConfig: this.accounts.globalConfig.toString(),
      inputTokenFeeAccount: this.accounts.inputTokenFeeAccount.toString(),
      pairConfig: this.accounts.pairConfig.toString(),
      dripPosition: this.accounts.dripPosition.toString(),
      dripPositionSigner: this.accounts.dripPositionSigner.toString(),
      dripPositionInputTokenAccount:
        this.accounts.dripPositionInputTokenAccount.toString(),
      dripPositionOutputTokenAccount:
        this.accounts.dripPositionOutputTokenAccount.toString(),
      dripperInputTokenAccount:
        this.accounts.dripperInputTokenAccount.toString(),
      instructions: this.accounts.instructions.toString(),
      tokenProgram: this.accounts.tokenProgram.toString(),
    }
  }
}
