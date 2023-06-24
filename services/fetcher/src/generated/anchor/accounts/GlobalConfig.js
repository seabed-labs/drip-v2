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
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value)
                  })
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value))
                } catch (e) {
                    reject(e)
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value))
                } catch (e) {
                    reject(e)
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected)
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            )
        })
    }
Object.defineProperty(exports, '__esModule', { value: true })
exports.GlobalConfig = void 0
// This file was automatically generated. DO NOT MODIFY DIRECTLY.
const web3_js_1 = require('@solana/web3.js')
const borsh = __importStar(require('@coral-xyz/borsh')) // eslint-disable-line @typescript-eslint/no-unused-vars
const programId_1 = require('../programId')
class GlobalConfig {
    constructor(fields) {
        this.version = fields.version
        this.superAdmin = fields.superAdmin
        this.admins = fields.admins
        this.adminPermissions = fields.adminPermissions
        this.defaultDripFeeBps = fields.defaultDripFeeBps
        this.globalConfigSigner = fields.globalConfigSigner
    }
    static fetch(c, address, programId = programId_1.PROGRAM_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const info = yield c.getAccountInfo(address)
            if (info === null) {
                return null
            }
            if (!info.owner.equals(programId)) {
                throw new Error("account doesn't belong to this program")
            }
            return this.decode(info.data)
        })
    }
    static fetchMultiple(c, addresses, programId = programId_1.PROGRAM_ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const infos = yield c.getMultipleAccountsInfo(addresses)
            return infos.map((info) => {
                if (info === null) {
                    return null
                }
                if (!info.owner.equals(programId)) {
                    throw new Error("account doesn't belong to this program")
                }
                return this.decode(info.data)
            })
        })
    }
    static decode(data) {
        if (!data.slice(0, 8).equals(GlobalConfig.discriminator)) {
            throw new Error('invalid account discriminator')
        }
        const dec = GlobalConfig.layout.decode(data.slice(8))
        return new GlobalConfig({
            version: dec.version,
            superAdmin: dec.superAdmin,
            admins: dec.admins,
            adminPermissions: dec.adminPermissions,
            defaultDripFeeBps: dec.defaultDripFeeBps,
            globalConfigSigner: dec.globalConfigSigner,
        })
    }
    toJSON() {
        return {
            version: this.version,
            superAdmin: this.superAdmin.toString(),
            admins: this.admins.map((item) => item.toString()),
            adminPermissions: this.adminPermissions.map((item) =>
                item.toString()
            ),
            defaultDripFeeBps: this.defaultDripFeeBps.toString(),
            globalConfigSigner: this.globalConfigSigner.toString(),
        }
    }
    static fromJSON(obj) {
        return new GlobalConfig({
            version: obj.version,
            superAdmin: new web3_js_1.PublicKey(obj.superAdmin),
            admins: obj.admins.map((item) => new web3_js_1.PublicKey(item)),
            adminPermissions: obj.adminPermissions.map((item) => BigInt(item)),
            defaultDripFeeBps: BigInt(obj.defaultDripFeeBps),
            globalConfigSigner: new web3_js_1.PublicKey(obj.globalConfigSigner),
        })
    }
}
exports.GlobalConfig = GlobalConfig
GlobalConfig.discriminator = Buffer.from([149, 8, 156, 202, 160, 252, 176, 217])
GlobalConfig.layout = borsh.struct([
    borsh.u8('version'),
    borsh.publicKey('superAdmin'),
    borsh.array(borsh.publicKey(), 20, 'admins'),
    borsh.array(borsh.u64(), 20, 'adminPermissions'),
    borsh.u64('defaultDripFeeBps'),
    borsh.publicKey('globalConfigSigner'),
])
//# sourceMappingURL=GlobalConfig.js.map
