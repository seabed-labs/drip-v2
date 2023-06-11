import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DripJSON {
  kind: "Drip"
}

export class Drip {
  static readonly discriminator = 0
  static readonly kind = "Drip"
  readonly discriminator = 0
  readonly kind = "Drip"

  toJSON(): DripJSON {
    return {
      kind: "Drip",
    }
  }

  toEncodable() {
    return {
      Drip: {},
    }
  }
}

export interface UpdateDefaultDripFeesJSON {
  kind: "UpdateDefaultDripFees"
}

export class UpdateDefaultDripFees {
  static readonly discriminator = 1
  static readonly kind = "UpdateDefaultDripFees"
  readonly discriminator = 1
  readonly kind = "UpdateDefaultDripFees"

  toJSON(): UpdateDefaultDripFeesJSON {
    return {
      kind: "UpdateDefaultDripFees",
    }
  }

  toEncodable() {
    return {
      UpdateDefaultDripFees: {},
    }
  }
}

export interface UpdatePythPriceFeedJSON {
  kind: "UpdatePythPriceFeed"
}

export class UpdatePythPriceFeed {
  static readonly discriminator = 2
  static readonly kind = "UpdatePythPriceFeed"
  readonly discriminator = 2
  readonly kind = "UpdatePythPriceFeed"

  toJSON(): UpdatePythPriceFeedJSON {
    return {
      kind: "UpdatePythPriceFeed",
    }
  }

  toEncodable() {
    return {
      UpdatePythPriceFeed: {},
    }
  }
}

export interface UpdateDefaultPairDripFeesJSON {
  kind: "UpdateDefaultPairDripFees"
}

export class UpdateDefaultPairDripFees {
  static readonly discriminator = 3
  static readonly kind = "UpdateDefaultPairDripFees"
  readonly discriminator = 3
  readonly kind = "UpdateDefaultPairDripFees"

  toJSON(): UpdateDefaultPairDripFeesJSON {
    return {
      kind: "UpdateDefaultPairDripFees",
    }
  }

  toEncodable() {
    return {
      UpdateDefaultPairDripFees: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.AdminPermissionKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("Drip" in obj) {
    return new Drip()
  }
  if ("UpdateDefaultDripFees" in obj) {
    return new UpdateDefaultDripFees()
  }
  if ("UpdatePythPriceFeed" in obj) {
    return new UpdatePythPriceFeed()
  }
  if ("UpdateDefaultPairDripFees" in obj) {
    return new UpdateDefaultPairDripFees()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(
  obj: types.AdminPermissionJSON
): types.AdminPermissionKind {
  switch (obj.kind) {
    case "Drip": {
      return new Drip()
    }
    case "UpdateDefaultDripFees": {
      return new UpdateDefaultDripFees()
    }
    case "UpdatePythPriceFeed": {
      return new UpdatePythPriceFeed()
    }
    case "UpdateDefaultPairDripFees": {
      return new UpdateDefaultPairDripFees()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([
    borsh.struct([], "Drip"),
    borsh.struct([], "UpdateDefaultDripFees"),
    borsh.struct([], "UpdatePythPriceFeed"),
    borsh.struct([], "UpdateDefaultPairDripFees"),
  ])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
