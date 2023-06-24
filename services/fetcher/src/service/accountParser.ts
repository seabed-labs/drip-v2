import { Accounts } from '@dcaf/drip-types'
import { RestError } from './types'

// note: we use drip-types here on purpose
// if the types in drip-types and the duplicated types in this generated/anchor diverge,
// it will result in a compilation error
export type DripAccountDecodeResponse =
    | {
          name: 'DripPosition'
          parsedDripPosition: Accounts.DripPositionJSON
      }
    | {
          name: 'DripPositionNftMapping'
          parsedDripPositionNftMapping: Accounts.DripPositionNftMappingJSON
      }
    | {
          name: 'DripPositionSigner'
          parsedDripPositionSigner: Accounts.DripPositionSignerJSON
      }
    | {
          name: 'GlobalConfig'
          parsedGlobalConfig: Accounts.GlobalConfigJSON
      }
    | {
          name: 'GlobalConfigSigner'
          parsedGlobalConfigSigner: Accounts.GlobalConfigSignerJSON
      }
    | {
          name: 'PairConfig'
          parsedPairConfig: Accounts.PairConfigJSON
      }

export function tryDecodeToParsedDripAccount(
    data: Buffer
): DripAccountDecodeResponse {
    const discriminator = data.slice(0, 8)
    if (discriminator.equals(Accounts.DripPosition.discriminator)) {
        return {
            name: 'DripPosition',
            parsedDripPosition: Accounts.DripPosition.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.DripPositionNftMapping.discriminator)
    ) {
        return {
            name: 'DripPositionNftMapping',
            parsedDripPositionNftMapping:
                Accounts.DripPositionNftMapping.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.DripPositionSigner.discriminator)
    ) {
        return {
            name: 'DripPositionSigner',
            parsedDripPositionSigner:
                Accounts.DripPositionSigner.decode(data).toJSON(),
        }
    } else if (discriminator.equals(Accounts.GlobalConfig.discriminator)) {
        return {
            name: 'GlobalConfig',
            parsedGlobalConfig: Accounts.GlobalConfig.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.GlobalConfigSigner.discriminator)
    ) {
        return {
            name: 'GlobalConfigSigner',
            parsedGlobalConfigSigner:
                Accounts.GlobalConfigSigner.decode(data).toJSON(),
        }
    } else if (discriminator.equals(Accounts.PairConfig.discriminator)) {
        return {
            name: 'PairConfig',
            parsedPairConfig: Accounts.PairConfig.decode(data).toJSON(),
        }
    }
    throw RestError.invalid(
        `unknown discriminator ${discriminator.toString('hex')}`
    )
}
