// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
// InitGlobalConfigFields are raw anchor decoded values
export interface InitGlobalConfigFields {
  params: types.InitGlobalConfigParamsFields
}
// InitGlobalConfigArgs convert properties to type classes if available. This is used for converting to JSON
export interface InitGlobalConfigArgs {
  params: types.InitGlobalConfigParams
}

export interface InitGlobalConfigFieldsJSON {
  params: types.InitGlobalConfigParamsJSON
}

export interface InitGlobalConfigAccounts {
  payer: PublicKey
  globalConfig: PublicKey
  globalConfigSigner: PublicKey
  systemProgram: PublicKey
}

export interface InitGlobalConfigAccountsJSON {
  payer: string
  globalConfig: string
  globalConfigSigner: string
  systemProgram: string
}

const layout = borsh.struct([types.InitGlobalConfigParams.layout("params")])

export class InitGlobalConfig {
  static readonly ixName = "initGlobalConfig"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>
  readonly args: InitGlobalConfigArgs

  constructor(
    readonly fields: InitGlobalConfigFields,
    readonly accounts: InitGlobalConfigAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([140, 136, 214, 48, 87, 0, 120, 255])
    this.keys = [
      { pubkey: this.accounts.payer, isSigner: true, isWritable: true },
      { pubkey: this.accounts.globalConfig, isSigner: true, isWritable: true },
      {
        pubkey: this.accounts.globalConfigSigner,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: this.accounts.systemProgram,
        isSigner: false,
        isWritable: false,
      },
    ]
    this.args = {
      params: new types.InitGlobalConfigParams({ ...fields.params }),
    }
  }

  static fromDecoded(
    fields: InitGlobalConfigFields,
    flattenedAccounts: PublicKey[]
  ) {
    const accounts = {
      payer: flattenedAccounts[0],
      globalConfig: flattenedAccounts[1],
      globalConfigSigner: flattenedAccounts[2],
      systemProgram: flattenedAccounts[3],
    }
    return new InitGlobalConfig(fields, accounts)
  }

  build() {
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
      {
        params: types.InitGlobalConfigParams.toEncodable(this.fields.params),
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

  toArgsJSON(): InitGlobalConfigFieldsJSON {
    return {
      params: this.args.params.toJSON(),
    }
  }

  toAccountsJSON(): InitGlobalConfigAccountsJSON {
    return {
      payer: this.accounts.payer.toString(),
      globalConfig: this.accounts.globalConfig.toString(),
      globalConfigSigner: this.accounts.globalConfigSigner.toString(),
      systemProgram: this.accounts.systemProgram.toString(),
    }
  }
}
