import * as DripPositionOwner from './DripPositionOwner'
import * as AdminStateUpdate from './AdminStateUpdate'
import * as AdminPermission from './AdminPermission'
import * as PriceOracle from './PriceOracle'

export { CollectFeesParams } from './CollectFeesParams'
export type {
    CollectFeesParamsFields,
    CollectFeesParamsJSON,
} from './CollectFeesParams'
export { DepositParams } from './DepositParams'
export type { DepositParamsFields, DepositParamsJSON } from './DepositParams'
export { InitDripPositionParams } from './InitDripPositionParams'
export type {
    InitDripPositionParamsFields,
    InitDripPositionParamsJSON,
} from './InitDripPositionParams'
export { InitGlobalConfigParams } from './InitGlobalConfigParams'
export type {
    InitGlobalConfigParamsFields,
    InitGlobalConfigParamsJSON,
} from './InitGlobalConfigParams'
export { UpdateAdminParams } from './UpdateAdminParams'
export type {
    UpdateAdminParamsFields,
    UpdateAdminParamsJSON,
} from './UpdateAdminParams'
export { UpdateDefaultDripFeesParams } from './UpdateDefaultDripFeesParams'
export type {
    UpdateDefaultDripFeesParamsFields,
    UpdateDefaultDripFeesParamsJSON,
} from './UpdateDefaultDripFeesParams'
export { UpdateDefaultPairDripFeesParams } from './UpdateDefaultPairDripFeesParams'
export type {
    UpdateDefaultPairDripFeesParamsFields,
    UpdateDefaultPairDripFeesParamsJSON,
} from './UpdateDefaultPairDripFeesParams'
export { WithdrawParams } from './WithdrawParams'
export type { WithdrawParamsFields, WithdrawParamsJSON } from './WithdrawParams'
export { DripPositionOwner }

export type DripPositionOwnerKind =
    | DripPositionOwner.Direct
    | DripPositionOwner.Tokenized
export type DripPositionOwnerJSON =
    | DripPositionOwner.DirectJSON
    | DripPositionOwner.TokenizedJSON

export { AdminStateUpdate }

export type AdminStateUpdateKind =
    | AdminStateUpdate.Clear
    | AdminStateUpdate.SetAdminAndResetPermissions
    | AdminStateUpdate.ResetPermissions
    | AdminStateUpdate.AddPermission
    | AdminStateUpdate.RemovePermission
export type AdminStateUpdateJSON =
    | AdminStateUpdate.ClearJSON
    | AdminStateUpdate.SetAdminAndResetPermissionsJSON
    | AdminStateUpdate.ResetPermissionsJSON
    | AdminStateUpdate.AddPermissionJSON
    | AdminStateUpdate.RemovePermissionJSON

export { AdminPermission }

export type AdminPermissionKind =
    | AdminPermission.Drip
    | AdminPermission.UpdateDefaultDripFees
    | AdminPermission.UpdatePythPriceFeed
    | AdminPermission.UpdateDefaultPairDripFees
    | AdminPermission.CollectFees
export type AdminPermissionJSON =
    | AdminPermission.DripJSON
    | AdminPermission.UpdateDefaultDripFeesJSON
    | AdminPermission.UpdatePythPriceFeedJSON
    | AdminPermission.UpdateDefaultPairDripFeesJSON
    | AdminPermission.CollectFeesJSON

export { PriceOracle }

export type PriceOracleKind = PriceOracle.Unavailable | PriceOracle.Pyth
export type PriceOracleJSON = PriceOracle.UnavailableJSON | PriceOracle.PythJSON
