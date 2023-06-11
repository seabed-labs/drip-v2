export type CustomError =
  | SuperAdminSignatureRequired
  | AdminIndexOutOfBounds
  | AdminPubkeyCannotBeDefault
  | FailedToConvertU64toUSize
  | OperationUnauthorized
  | CannotSerializePriceFeedAccount
  | PythPriceFeedLoadError
  | UnexpectedFeeTokenAccount
  | FeeRecipientMismatch
  | GlobalConfigMismatch
  | GlobalConfigGlobalSignerMismatch

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

export class UnexpectedFeeTokenAccount extends Error {
  static readonly code = 6007
  readonly code = 6007
  readonly name = "UnexpectedFeeTokenAccount"
  readonly msg = "Unexpected fee token account"

  constructor(readonly logs?: string[]) {
    super("6007: Unexpected fee token account")
  }
}

export class FeeRecipientMismatch extends Error {
  static readonly code = 6008
  readonly code = 6008
  readonly name = "FeeRecipientMismatch"
  readonly msg = "Fee recipient token account owner does not match"

  constructor(readonly logs?: string[]) {
    super("6008: Fee recipient token account owner does not match")
  }
}

export class GlobalConfigMismatch extends Error {
  static readonly code = 6009
  readonly code = 6009
  readonly name = "GlobalConfigMismatch"
  readonly msg = "Global config mismatch"

  constructor(readonly logs?: string[]) {
    super("6009: Global config mismatch")
  }
}

export class GlobalConfigGlobalSignerMismatch extends Error {
  static readonly code = 6010
  readonly code = 6010
  readonly name = "GlobalConfigGlobalSignerMismatch"
  readonly msg = "Global config and global signer mismatch"

  constructor(readonly logs?: string[]) {
    super("6010: Global config and global signer mismatch")
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
    case 6007:
      return new UnexpectedFeeTokenAccount(logs)
    case 6008:
      return new FeeRecipientMismatch(logs)
    case 6009:
      return new GlobalConfigMismatch(logs)
    case 6010:
      return new GlobalConfigGlobalSignerMismatch(logs)
  }

  return null
}
