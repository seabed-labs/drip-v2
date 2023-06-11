import * as AdminStateUpdate from "./AdminStateUpdate"
import * as AdminPermission from "./AdminPermission"
import * as PriceOracle from "./PriceOracle"

export { InitGlobalConfigParams } from "./InitGlobalConfigParams"
export type {
  InitGlobalConfigParamsFields,
  InitGlobalConfigParamsJSON,
} from "./InitGlobalConfigParams"
export { UpdateAdminParams } from "./UpdateAdminParams"
export type {
  UpdateAdminParamsFields,
  UpdateAdminParamsJSON,
} from "./UpdateAdminParams"
export { UpdateDefaultDripFeesParams } from "./UpdateDefaultDripFeesParams"
export type {
  UpdateDefaultDripFeesParamsFields,
  UpdateDefaultDripFeesParamsJSON,
} from "./UpdateDefaultDripFeesParams"
export { UpdateDefaultPairDripFeesParams } from "./UpdateDefaultPairDripFeesParams"
export type {
  UpdateDefaultPairDripFeesParamsFields,
  UpdateDefaultPairDripFeesParamsJSON,
} from "./UpdateDefaultPairDripFeesParams"
export { UpdateSuperAdminParams } from "./UpdateSuperAdminParams"
export type {
  UpdateSuperAdminParamsFields,
  UpdateSuperAdminParamsJSON,
} from "./UpdateSuperAdminParams"
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
export type AdminPermissionJSON =
  | AdminPermission.DripJSON
  | AdminPermission.UpdateDefaultDripFeesJSON
  | AdminPermission.UpdatePythPriceFeedJSON
  | AdminPermission.UpdateDefaultPairDripFeesJSON

export { PriceOracle }

export type PriceOracleKind = PriceOracle.Unavailable | PriceOracle.Pyth
export type PriceOracleJSON = PriceOracle.UnavailableJSON | PriceOracle.PythJSON
