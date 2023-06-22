import { Accounts } from '@dcaf/drip-types'
import { RestError } from './types'

// note: we use drip-types here on purpose
// if the types in drip-types and the duplicated types in this generated/anchor diverge,
// it will result in a compilation error
export type DripAccountDecodeResponse =
    | {
          name: 'DripPosition'
          parsed: Accounts.DripPositionJSON
      }
    | {
          name: 'DripPositionNftMapping'
          parsed: Accounts.DripPositionNftMappingJSON
      }
    | {
          name: 'DripPositionSigner'
          parsed: Accounts.DripPositionSignerJSON
      }
    | {
          name: 'GlobalConfig'
          parsed: Accounts.GlobalConfigJSON
      }
    | {
          name: 'GlobalConfigSigner'
          parsed: Accounts.GlobalConfigSignerJSON
      }
    | {
          name: 'PairConfig'
          parsed: Accounts.PairConfigJSON
      }

export function tryDecodeToParsedDripAccount(
    data: Buffer
): DripAccountDecodeResponse {
    const discriminator = data.slice(0, 8)
    if (discriminator.equals(Accounts.DripPosition.discriminator)) {
        return {
            name: 'DripPosition',
            parsed: Accounts.DripPosition.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.DripPositionNftMapping.discriminator)
    ) {
        return {
            name: 'DripPositionNftMapping',
            parsed: Accounts.DripPositionNftMapping.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.DripPositionSigner.discriminator)
    ) {
        return {
            name: 'DripPositionSigner',
            parsed: Accounts.DripPositionSigner.decode(data).toJSON(),
        }
    } else if (discriminator.equals(Accounts.GlobalConfig.discriminator)) {
        return {
            name: 'GlobalConfig',
            parsed: Accounts.GlobalConfig.decode(data).toJSON(),
        }
    } else if (
        discriminator.equals(Accounts.GlobalConfigSigner.discriminator)
    ) {
        return {
            name: 'GlobalConfigSigner',
            parsed: Accounts.GlobalConfigSigner.decode(data).toJSON(),
        }
    } else if (discriminator.equals(Accounts.PairConfig.discriminator)) {
        return {
            name: 'PairConfig',
            parsed: Accounts.PairConfig.decode(data).toJSON(),
        }
    }
    throw RestError.invalid(
        `unknown discriminator ${discriminator.toString('hex')}`
    )
}
