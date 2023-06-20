// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"
// UpdateDefaultPairDripFeesFields are raw anchor decoded values
export interface UpdateDefaultPairDripFeesFields {
  params: types.UpdateDefaultPairDripFeesParamsFields
}
// UpdateDefaultPairDripFeesArgs convert properties to type classes if available. This is used for converting to JSON
export interface UpdateDefaultPairDripFeesArgs {
  params: types.UpdateDefaultPairDripFeesParams
}

export interface UpdateDefaultPairDripFeesFieldsJSON {
  params: types.UpdateDefaultPairDripFeesParamsJSON
}

export interface UpdateDefaultPairDripFeesAccounts {
  signer: PublicKey
  pairConfig: PublicKey
  globalConfig: PublicKey
}

export interface UpdateDefaultPairDripFeesAccountsJSON {
  signer: string
  pairConfig: string
  globalConfig: string
}

const layout = borsh.struct([
  types.UpdateDefaultPairDripFeesParams.layout("params"),
])

export class UpdateDefaultPairDripFees {
  static readonly ixName = "updateDefaultPairDripFees"
  readonly identifier: Buffer
  readonly keys: Array<AccountMeta>
  readonly args: UpdateDefaultPairDripFeesArgs

  constructor(
    readonly fields: UpdateDefaultPairDripFeesFields,
    readonly accounts: UpdateDefaultPairDripFeesAccounts,
    readonly programId: PublicKey = PROGRAM_ID
  ) {
    this.identifier = Buffer.from([213, 197, 141, 244, 167, 253, 130, 190])
    this.keys = [
      { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
      { pubkey: this.accounts.pairConfig, isSigner: false, isWritable: true },
      {
        pubkey: this.accounts.globalConfig,
        isSigner: false,
        isWritable: false,
      },
    ]
    this.args = {
      params: new types.UpdateDefaultPairDripFeesParams({ ...fields.params }),
    }
  }

  static fromDecoded(
    fields: UpdateDefaultPairDripFeesFields,
    flattenedAccounts: PublicKey[]
  ) {
    const accounts = {
      signer: flattenedAccounts[0],
      pairConfig: flattenedAccounts[1],
      globalConfig: flattenedAccounts[2],
    }
    return new UpdateDefaultPairDripFees(fields, accounts)
  }

  build() {
    const buffer = Buffer.alloc(1000)
    const len = layout.encode(
      {
        params: types.UpdateDefaultPairDripFeesParams.toEncodable(
          this.fields.params
        ),
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

  toArgsJSON(): UpdateDefaultPairDripFeesFieldsJSON {
    return {
      params: this.args.params.toJSON(),
    }
  }

  toAccountsJSON(): UpdateDefaultPairDripFeesAccountsJSON {
    return {
      signer: this.accounts.signer.toString(),
      pairConfig: this.accounts.pairConfig.toString(),
      globalConfig: this.accounts.globalConfig.toString(),
    }
  }
}
