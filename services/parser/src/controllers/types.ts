import {
    DripPositionJSON,
    DripPositionNftMappingJSON,
    DripPositionSignerJSON,
    GlobalConfigJSON,
    GlobalConfigSignerJSON,
    PairConfigJSON,
} from '../generated/anchor'

export type ResponseCommon<T extends object, E extends Error> =
    | {
          serverTimestamp: number
          data: T
          error?: E
      }
    | {
          serverTimestamp: number
          data?: T
          error: E
      }

export type PingResponse = ResponseCommon<
    {
        message: string
    },
    Error
>

export type parsedAccountCommon = {
    publicKey: string
    name:
        | 'DripPosition'
        | 'DripPositionNftMapping'
        | 'DripPositionSigner'
        | 'GlobalConfig'
        | 'GlobalConfigSigner'
        | 'PairConfig'
}

export type ParsedAccountResponse = ResponseCommon<
    {
        publicKey: string
        name:
            | 'DripPosition'
            | 'DripPositionNftMapping'
            | 'DripPositionSigner'
            | 'GlobalConfig'
            | 'GlobalConfigSigner'
            | 'PairConfig'
        account:
            | DripPositionJSON
            | DripPositionNftMappingJSON
            | DripPositionSignerJSON
            | GlobalConfigJSON
            | GlobalConfigSignerJSON
            | PairConfigJSON
    },
    Error
>
