import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface DripPositionFields {
  globalConfig: PublicKey
  owner: types.DripPositionOwnerKind
  dripPositionSigner: PublicKey
  autoCreditEnabled: boolean
  inputTokenMint: PublicKey
  outputTokenMint: PublicKey
  inputTokenAccount: PublicKey
  outputTokenAccount: PublicKey
  dripAmount: BN
  frequencyInSeconds: BN
  totalInputTokenDripped: BN
  totalOutputTokenReceived: BN
}

export interface DripPositionJSON {
  globalConfig: string
  owner: types.DripPositionOwnerJSON
  dripPositionSigner: string
  autoCreditEnabled: boolean
  inputTokenMint: string
  outputTokenMint: string
  inputTokenAccount: string
  outputTokenAccount: string
  dripAmount: string
  frequencyInSeconds: string
  totalInputTokenDripped: string
  totalOutputTokenReceived: string
}

export class DripPosition {
  readonly globalConfig: PublicKey
  readonly owner: types.DripPositionOwnerKind
  readonly dripPositionSigner: PublicKey
  readonly autoCreditEnabled: boolean
  readonly inputTokenMint: PublicKey
  readonly outputTokenMint: PublicKey
  readonly inputTokenAccount: PublicKey
  readonly outputTokenAccount: PublicKey
  readonly dripAmount: BN
  readonly frequencyInSeconds: BN
  readonly totalInputTokenDripped: BN
  readonly totalOutputTokenReceived: BN

  static readonly discriminator = Buffer.from([
    4, 250, 161, 172, 41, 156, 53, 219,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("globalConfig"),
    types.DripPositionOwner.layout("owner"),
    borsh.publicKey("dripPositionSigner"),
    borsh.bool("autoCreditEnabled"),
    borsh.publicKey("inputTokenMint"),
    borsh.publicKey("outputTokenMint"),
    borsh.publicKey("inputTokenAccount"),
    borsh.publicKey("outputTokenAccount"),
    borsh.u64("dripAmount"),
    borsh.u64("frequencyInSeconds"),
    borsh.u64("totalInputTokenDripped"),
    borsh.u64("totalOutputTokenReceived"),
  ])

  constructor(fields: DripPositionFields) {
    this.globalConfig = fields.globalConfig
    this.owner = fields.owner
    this.dripPositionSigner = fields.dripPositionSigner
    this.autoCreditEnabled = fields.autoCreditEnabled
    this.inputTokenMint = fields.inputTokenMint
    this.outputTokenMint = fields.outputTokenMint
    this.inputTokenAccount = fields.inputTokenAccount
    this.outputTokenAccount = fields.outputTokenAccount
    this.dripAmount = fields.dripAmount
    this.frequencyInSeconds = fields.frequencyInSeconds
    this.totalInputTokenDripped = fields.totalInputTokenDripped
    this.totalOutputTokenReceived = fields.totalOutputTokenReceived
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<DripPosition | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(programId)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[],
    programId: PublicKey = PROGRAM_ID
  ): Promise<Array<DripPosition | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(programId)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): DripPosition {
    if (!data.slice(0, 8).equals(DripPosition.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = DripPosition.layout.decode(data.slice(8))

    return new DripPosition({
      globalConfig: dec.globalConfig,
      owner: types.DripPositionOwner.fromDecoded(dec.owner),
      dripPositionSigner: dec.dripPositionSigner,
      autoCreditEnabled: dec.autoCreditEnabled,
      inputTokenMint: dec.inputTokenMint,
      outputTokenMint: dec.outputTokenMint,
      inputTokenAccount: dec.inputTokenAccount,
      outputTokenAccount: dec.outputTokenAccount,
      dripAmount: dec.dripAmount,
      frequencyInSeconds: dec.frequencyInSeconds,
      totalInputTokenDripped: dec.totalInputTokenDripped,
      totalOutputTokenReceived: dec.totalOutputTokenReceived,
    })
  }

  toJSON(): DripPositionJSON {
    return {
      globalConfig: this.globalConfig.toString(),
      owner: this.owner.toJSON(),
      dripPositionSigner: this.dripPositionSigner.toString(),
      autoCreditEnabled: this.autoCreditEnabled,
      inputTokenMint: this.inputTokenMint.toString(),
      outputTokenMint: this.outputTokenMint.toString(),
      inputTokenAccount: this.inputTokenAccount.toString(),
      outputTokenAccount: this.outputTokenAccount.toString(),
      dripAmount: this.dripAmount.toString(),
      frequencyInSeconds: this.frequencyInSeconds.toString(),
      totalInputTokenDripped: this.totalInputTokenDripped.toString(),
      totalOutputTokenReceived: this.totalOutputTokenReceived.toString(),
    }
  }

  static fromJSON(obj: DripPositionJSON): DripPosition {
    return new DripPosition({
      globalConfig: new PublicKey(obj.globalConfig),
      owner: types.DripPositionOwner.fromJSON(obj.owner),
      dripPositionSigner: new PublicKey(obj.dripPositionSigner),
      autoCreditEnabled: obj.autoCreditEnabled,
      inputTokenMint: new PublicKey(obj.inputTokenMint),
      outputTokenMint: new PublicKey(obj.outputTokenMint),
      inputTokenAccount: new PublicKey(obj.inputTokenAccount),
      outputTokenAccount: new PublicKey(obj.outputTokenAccount),
      dripAmount: new BN(obj.dripAmount),
      frequencyInSeconds: new BN(obj.frequencyInSeconds),
      totalInputTokenDripped: new BN(obj.totalInputTokenDripped),
      totalOutputTokenReceived: new BN(obj.totalOutputTokenReceived),
    })
  }
}
