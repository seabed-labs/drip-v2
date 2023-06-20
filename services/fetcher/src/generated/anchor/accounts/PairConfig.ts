// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { PublicKey, Connection } from "@solana/web3.js"
import * as borsh from "@coral-xyz/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface PairConfigFields {
  version: number
  globalConfig: PublicKey
  inputTokenMint: PublicKey
  outputTokenMint: PublicKey
  bump: number
  defaultPairDripFeeBps: bigint
  inputTokenDripFeePortionBps: bigint
  inputTokenPriceOracle: types.PriceOracleKind
  outputTokenPriceOracle: types.PriceOracleKind
}

export interface PairConfigJSON {
  version: number
  globalConfig: string
  inputTokenMint: string
  outputTokenMint: string
  bump: number
  defaultPairDripFeeBps: string
  inputTokenDripFeePortionBps: string
  inputTokenPriceOracle: types.PriceOracleJSON
  outputTokenPriceOracle: types.PriceOracleJSON
}

export class PairConfig {
  readonly version: number
  readonly globalConfig: PublicKey
  readonly inputTokenMint: PublicKey
  readonly outputTokenMint: PublicKey
  readonly bump: number
  readonly defaultPairDripFeeBps: bigint
  readonly inputTokenDripFeePortionBps: bigint
  readonly inputTokenPriceOracle: types.PriceOracleKind
  readonly outputTokenPriceOracle: types.PriceOracleKind

  static readonly discriminator = Buffer.from([
    119, 167, 13, 129, 136, 228, 151, 77,
  ])

  static readonly layout = borsh.struct([
    borsh.u8("version"),
    borsh.publicKey("globalConfig"),
    borsh.publicKey("inputTokenMint"),
    borsh.publicKey("outputTokenMint"),
    borsh.u8("bump"),
    borsh.u64("defaultPairDripFeeBps"),
    borsh.u64("inputTokenDripFeePortionBps"),
    types.PriceOracle.layout("inputTokenPriceOracle"),
    types.PriceOracle.layout("outputTokenPriceOracle"),
  ])

  constructor(fields: PairConfigFields) {
    this.version = fields.version
    this.globalConfig = fields.globalConfig
    this.inputTokenMint = fields.inputTokenMint
    this.outputTokenMint = fields.outputTokenMint
    this.bump = fields.bump
    this.defaultPairDripFeeBps = fields.defaultPairDripFeeBps
    this.inputTokenDripFeePortionBps = fields.inputTokenDripFeePortionBps
    this.inputTokenPriceOracle = fields.inputTokenPriceOracle
    this.outputTokenPriceOracle = fields.outputTokenPriceOracle
  }

  static async fetch(
    c: Connection,
    address: PublicKey,
    programId: PublicKey = PROGRAM_ID
  ): Promise<PairConfig | null> {
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
  ): Promise<Array<PairConfig | null>> {
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

  static decode(data: Buffer): PairConfig {
    if (!data.slice(0, 8).equals(PairConfig.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = PairConfig.layout.decode(data.slice(8))

    return new PairConfig({
      version: dec.version,
      globalConfig: dec.globalConfig,
      inputTokenMint: dec.inputTokenMint,
      outputTokenMint: dec.outputTokenMint,
      bump: dec.bump,
      defaultPairDripFeeBps: dec.defaultPairDripFeeBps,
      inputTokenDripFeePortionBps: dec.inputTokenDripFeePortionBps,
      inputTokenPriceOracle: types.PriceOracle.fromDecoded(
        dec.inputTokenPriceOracle
      ),
      outputTokenPriceOracle: types.PriceOracle.fromDecoded(
        dec.outputTokenPriceOracle
      ),
    })
  }

  toJSON(): PairConfigJSON {
    return {
      version: this.version,
      globalConfig: this.globalConfig.toString(),
      inputTokenMint: this.inputTokenMint.toString(),
      outputTokenMint: this.outputTokenMint.toString(),
      bump: this.bump,
      defaultPairDripFeeBps: this.defaultPairDripFeeBps.toString(),
      inputTokenDripFeePortionBps: this.inputTokenDripFeePortionBps.toString(),
      inputTokenPriceOracle: this.inputTokenPriceOracle.toJSON(),
      outputTokenPriceOracle: this.outputTokenPriceOracle.toJSON(),
    }
  }

  static fromJSON(obj: PairConfigJSON): PairConfig {
    return new PairConfig({
      version: obj.version,
      globalConfig: new PublicKey(obj.globalConfig),
      inputTokenMint: new PublicKey(obj.inputTokenMint),
      outputTokenMint: new PublicKey(obj.outputTokenMint),
      bump: obj.bump,
      defaultPairDripFeeBps: BigInt(obj.defaultPairDripFeeBps),
      inputTokenDripFeePortionBps: BigInt(obj.inputTokenDripFeePortionBps),
      inputTokenPriceOracle: types.PriceOracle.fromJSON(
        obj.inputTokenPriceOracle
      ),
      outputTokenPriceOracle: types.PriceOracle.fromJSON(
        obj.outputTokenPriceOracle
      ),
    })
  }
}
