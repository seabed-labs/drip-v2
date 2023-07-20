import {
    DripPosition,
    DripPositionNftMapping,
    DripPositionSigner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
    DripPositionNftMappingAccountJSON,
    DripPositionSignerAccountJSON,
    GlobalConfigAccountJSON,
    GlobalConfigSignerAccountJSON,
} from '@dcaf/drip-types/src/accounts';
import {
    DripPositionJSONWrapper,
    PairConfigJSONWrapper,
    RestError,
} from './types';

// note: we use drip-types here on purpose
// if the types in drip-types and the duplicated types in this generated/anchor diverge,
// it will result in a compilation error
export type DripAccountDecodeResponse =
    | {
          name: 'DripPosition';
          parsedDripPosition: DripPositionJSONWrapper;
      }
    | {
          name: 'DripPositionNftMapping';
          parsedDripPositionNftMapping: DripPositionNftMappingAccountJSON;
      }
    | {
          name: 'DripPositionSigner';
          parsedDripPositionSigner: DripPositionSignerAccountJSON;
      }
    | {
          name: 'GlobalConfig';
          parsedGlobalConfig: GlobalConfigAccountJSON;
      }
    | {
          name: 'GlobalConfigSigner';
          parsedGlobalConfigSigner: GlobalConfigSignerAccountJSON;
      }
    | {
          name: 'PairConfig';
          parsedPairConfig: PairConfigJSONWrapper;
      };

export function tryDecodeToParsedDripAccount(
    data: Buffer
): DripAccountDecodeResponse {
    const discriminator = data.slice(0, 8);
    if (discriminator.equals(DripPosition.discriminator)) {
        const decodedData = DripPosition.decode(data).toJSON();
        const owner =
            decodedData.owner.kind === 'Direct'
                ? decodedData.owner.value.owner
                : decodedData.owner.kind === 'Tokenized'
                ? undefined
                : null;
        if (owner === null) {
            throw RestError.internal(
                `DripPosition owner value unexpected for kind ${decodedData.owner.kind}`
            );
        }
        return {
            name: 'DripPosition',
            parsedDripPosition: {
                ...decodedData,
                owner,
                ownerType: decodedData.owner.kind,
            },
        };
    } else if (discriminator.equals(DripPosition.discriminator)) {
        return {
            name: 'DripPositionNftMapping',
            parsedDripPositionNftMapping:
                DripPositionNftMapping.decode(data).toJSON(),
        };
    } else if (discriminator.equals(DripPositionSigner.discriminator)) {
        return {
            name: 'DripPositionSigner',
            parsedDripPositionSigner: DripPositionSigner.decode(data).toJSON(),
        };
    } else if (discriminator.equals(GlobalConfig.discriminator)) {
        return {
            name: 'GlobalConfig',
            parsedGlobalConfig: GlobalConfig.decode(data).toJSON(),
        };
    } else if (discriminator.equals(GlobalConfigSigner.discriminator)) {
        return {
            name: 'GlobalConfigSigner',
            parsedGlobalConfigSigner: GlobalConfigSigner.decode(data).toJSON(),
        };
    } else if (discriminator.equals(PairConfig.discriminator)) {
        const decodedData = PairConfig.decode(data).toJSON();
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
        };
    }
    throw RestError.invalid(
        `unknown discriminator ${discriminator.toString('hex')}`
    );
}
