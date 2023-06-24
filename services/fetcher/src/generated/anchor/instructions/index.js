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
var __exportStar =
    (this && this.__exportStar) ||
    function (m, exports) {
        for (var p in m)
            if (
                p !== 'default' &&
                !Object.prototype.hasOwnProperty.call(exports, p)
            )
                __createBinding(exports, m, p)
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.DripV2InstructionNames = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
__exportStar(require('./initGlobalConfig'), exports)
__exportStar(require('./initPairConfig'), exports)
__exportStar(require('./updateSuperAdmin'), exports)
__exportStar(require('./updateAdmin'), exports)
__exportStar(require('./updateDefaultDripFees'), exports)
__exportStar(require('./updatePythPriceFeed'), exports)
__exportStar(require('./updateDefaultPairDripFees'), exports)
__exportStar(require('./collectFees'), exports)
__exportStar(require('./initDripPosition'), exports)
__exportStar(require('./initDripPositionNft'), exports)
__exportStar(require('./tokenizeDripPosition'), exports)
__exportStar(require('./detokenizeDripPosition'), exports)
__exportStar(require('./toggleAutoCredit'), exports)
__exportStar(require('./deposit'), exports)
__exportStar(require('./withdraw'), exports)
var DripV2InstructionNames
;(function (DripV2InstructionNames) {
    DripV2InstructionNames['initGlobalConfig'] = 'initGlobalConfig'
    DripV2InstructionNames['initPairConfig'] = 'initPairConfig'
    DripV2InstructionNames['updateSuperAdmin'] = 'updateSuperAdmin'
    DripV2InstructionNames['updateAdmin'] = 'updateAdmin'
    DripV2InstructionNames['updateDefaultDripFees'] = 'updateDefaultDripFees'
    DripV2InstructionNames['updatePythPriceFeed'] = 'updatePythPriceFeed'
    DripV2InstructionNames['updateDefaultPairDripFees'] =
        'updateDefaultPairDripFees'
    DripV2InstructionNames['collectFees'] = 'collectFees'
    DripV2InstructionNames['initDripPosition'] = 'initDripPosition'
    DripV2InstructionNames['initDripPositionNft'] = 'initDripPositionNft'
    DripV2InstructionNames['tokenizeDripPosition'] = 'tokenizeDripPosition'
    DripV2InstructionNames['detokenizeDripPosition'] = 'detokenizeDripPosition'
    DripV2InstructionNames['toggleAutoCredit'] = 'toggleAutoCredit'
    DripV2InstructionNames['deposit'] = 'deposit'
    DripV2InstructionNames['withdraw'] = 'withdraw'
})(
    DripV2InstructionNames ||
        (exports.DripV2InstructionNames = DripV2InstructionNames = {})
)
//# sourceMappingURL=index.js.map
