import { Accounts } from '@dcaf/drip-types'
import {
    DripPositionJSONWrapper,
    PairConfigJSONWrapper,
    RestError,
} from './types'

// note: we use drip-types here on purpose
// if the types in drip-types and the duplicated types in this generated/anchor diverge,
// it will result in a compilation error
export type DripAccountDecodeResponse =
    | {
          name: 'DripPosition'
          parsedDripPosition: DripPositionJSONWrapper
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
          parsedPairConfig: PairConfigJSONWrapper
      }

export function tryDecodeToParsedDripAccount(
    data: Buffer
): DripAccountDecodeResponse {
    const discriminator = data.slice(0, 8)
    if (discriminator.equals(Accounts.DripPosition.discriminator)) {
        const decodedData = Accounts.DripPosition.decode(data).toJSON()
        const owner =
            decodedData.owner.kind === 'Direct'
                ? decodedData.owner.value.owner
                : decodedData.owner.kind === 'Tokenized'
                ? undefined
                : null
        if (owner === null) {
            throw RestError.internal(
                `DripPosition owner value unexpected for kind ${decodedData.owner.kind}`
            )
        }
        return {
            name: 'DripPosition',
            parsedDripPosition: {
                ...decodedData,
                owner,
                ownerType: decodedData.owner.kind,
            },
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
        const decodedData = Accounts.PairConfig.decode(data).toJSON()
        return {
            name: 'PairConfig',
            parsedPairConfig: {
                ...decodedData,
                inputTokenPriceOracle: {
                    priceOracleJsonIsPyth:
                        decodedData.inputTokenPriceOracle.kind ===
                        'Unavailable',
                    priceOracleJsonIsUnavailable:
                        decodedData.inputTokenPriceOracle.kind ===
                        'Unavailable',
                },
                outputTokenPriceOracle: {
                    priceOracleJsonIsPyth:
                        decodedData.outputTokenPriceOracle.kind ===
                        'Unavailable',
                    priceOracleJsonIsUnavailable:
                        decodedData.outputTokenPriceOracle.kind ===
                        'Unavailable',
                },
            },
        }
    }
    throw RestError.invalid(
        `unknown discriminator ${discriminator.toString('hex')}`
    )
}
