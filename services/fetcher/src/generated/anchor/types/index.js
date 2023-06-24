'use strict'
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              var desc = Object.getOwnPropertyDescriptor(m, k)
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k]
                      },
                  }
              }
              Object.defineProperty(o, k2, desc)
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k
              o[k2] = m[k]
          })
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              })
          }
        : function (o, v) {
              o['default'] = v
          })
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod
        var result = {}
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k)
        __setModuleDefault(result, mod)
        return result
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.PriceOracle =
    exports.AdminPermission =
    exports.AdminStateUpdate =
    exports.DripPositionOwner =
    exports.WithdrawParams =
    exports.UpdateDefaultPairDripFeesParams =
    exports.UpdateDefaultDripFeesParams =
    exports.UpdateAdminParams =
    exports.InitGlobalConfigParams =
    exports.InitDripPositionParams =
    exports.DepositParams =
    exports.CollectFeesParams =
        void 0
const DripPositionOwner = __importStar(require('./DripPositionOwner'))
exports.DripPositionOwner = DripPositionOwner
const AdminStateUpdate = __importStar(require('./AdminStateUpdate'))
exports.AdminStateUpdate = AdminStateUpdate
const AdminPermission = __importStar(require('./AdminPermission'))
exports.AdminPermission = AdminPermission
const PriceOracle = __importStar(require('./PriceOracle'))
exports.PriceOracle = PriceOracle
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
var CollectFeesParams_1 = require('./CollectFeesParams')
Object.defineProperty(exports, 'CollectFeesParams', {
    enumerable: true,
    get: function () {
        return CollectFeesParams_1.CollectFeesParams
    },
})
var DepositParams_1 = require('./DepositParams')
Object.defineProperty(exports, 'DepositParams', {
    enumerable: true,
    get: function () {
        return DepositParams_1.DepositParams
    },
})
var InitDripPositionParams_1 = require('./InitDripPositionParams')
Object.defineProperty(exports, 'InitDripPositionParams', {
    enumerable: true,
    get: function () {
        return InitDripPositionParams_1.InitDripPositionParams
    },
})
var InitGlobalConfigParams_1 = require('./InitGlobalConfigParams')
Object.defineProperty(exports, 'InitGlobalConfigParams', {
    enumerable: true,
    get: function () {
        return InitGlobalConfigParams_1.InitGlobalConfigParams
    },
})
var UpdateAdminParams_1 = require('./UpdateAdminParams')
Object.defineProperty(exports, 'UpdateAdminParams', {
    enumerable: true,
    get: function () {
        return UpdateAdminParams_1.UpdateAdminParams
    },
})
var UpdateDefaultDripFeesParams_1 = require('./UpdateDefaultDripFeesParams')
Object.defineProperty(exports, 'UpdateDefaultDripFeesParams', {
    enumerable: true,
    get: function () {
        return UpdateDefaultDripFeesParams_1.UpdateDefaultDripFeesParams
    },
})
var UpdateDefaultPairDripFeesParams_1 = require('./UpdateDefaultPairDripFeesParams')
Object.defineProperty(exports, 'UpdateDefaultPairDripFeesParams', {
    enumerable: true,
    get: function () {
        return UpdateDefaultPairDripFeesParams_1.UpdateDefaultPairDripFeesParams
    },
})
var WithdrawParams_1 = require('./WithdrawParams')
Object.defineProperty(exports, 'WithdrawParams', {
    enumerable: true,
    get: function () {
        return WithdrawParams_1.WithdrawParams
    },
})
//# sourceMappingURL=index.js.map
