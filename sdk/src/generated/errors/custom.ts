export type CustomError =
  | SuperAdminSignatureRequired
  | AdminIndexOutOfBounds
  | AdminPubkeyCannotBeDefault
  | FailedToConvertU64toUSize
  | OperationUnauthorized
  | CannotSerializePriceFeedAccount
  | PythPriceFeedLoadError

export class SuperAdminSignatureRequired extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "SuperAdminSignatureRequired"
  readonly msg = "Signer is not super_admin"

  constructor(readonly logs?: string[]) {
    super("6000: Signer is not super_admin")
  }
}

export class AdminIndexOutOfBounds extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "AdminIndexOutOfBounds"
  readonly msg = "Admin index out of bounds"

  constructor(readonly logs?: string[]) {
    super("6001: Admin index out of bounds")
  }
}

export class AdminPubkeyCannotBeDefault extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "AdminPubkeyCannotBeDefault"
  readonly msg = "SuperAdmin/Admin pubkey cannot be default"

  constructor(readonly logs?: string[]) {
    super("6002: SuperAdmin/Admin pubkey cannot be default")
  }
}

export class FailedToConvertU64toUSize extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "FailedToConvertU64toUSize"
  readonly msg = "Failed to convert u64 to usize"

  constructor(readonly logs?: string[]) {
    super("6003: Failed to convert u64 to usize")
  }
}

export class OperationUnauthorized extends Error {
  static readonly code = 6004
  readonly code = 6004
  readonly name = "OperationUnauthorized"
  readonly msg =
    "Unauthorized; Requires admin permission for this op or super admin signature"

  constructor(readonly logs?: string[]) {
    super(
      "6004: Unauthorized; Requires admin permission for this op or super admin signature"
    )
  }
}

export class CannotSerializePriceFeedAccount extends Error {
  static readonly code = 6005
  readonly code = 6005
  readonly name = "CannotSerializePriceFeedAccount"
  readonly msg = "Pyth PriceFeed account serialization not supported"

  constructor(readonly logs?: string[]) {
    super("6005: Pyth PriceFeed account serialization not supported")
  }
}

export class PythPriceFeedLoadError extends Error {
  static readonly code = 6006
  readonly code = 6006
  readonly name = "PythPriceFeedLoadError"
  readonly msg = "Error when loading price from Pyth PriceFeed"

  constructor(readonly logs?: string[]) {
    super("6006: Error when loading price from Pyth PriceFeed")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new SuperAdminSignatureRequired(logs)
    case 6001:
      return new AdminIndexOutOfBounds(logs)
    case 6002:
      return new AdminPubkeyCannotBeDefault(logs)
    case 6003:
      return new FailedToConvertU64toUSize(logs)
    case 6004:
      return new OperationUnauthorized(logs)
    case 6005:
      return new CannotSerializePriceFeedAccount(logs)
    case 6006:
      return new PythPriceFeedLoadError(logs)
  }

  return null
}
