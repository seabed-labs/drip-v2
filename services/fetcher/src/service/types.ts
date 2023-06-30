import {
    DripPositionJSON,
    DripPositionNftMappingJSON,
    DripPositionSignerJSON,
    GlobalConfigJSON,
    GlobalConfigSignerJSON,
    PairConfigJSON,
} from '../generated/anchor/accounts';
import {
    DepositAccountsJSON,
    DepositFieldsJSON,
    DetokenizeDripPositionAccountsJSON,
    DripV2InstructionNames,
    InitDripPositionAccountsJSON,
    InitDripPositionFieldsJSON,
    UpdateDefaultPairDripFeesAccountsJSON,
    UpdateDefaultPairDripFeesFieldsJSON,
    InitDripPositionNftAccountsJSON,
    InitGlobalConfigAccountsJSON,
    InitGlobalConfigFieldsJSON,
    InitPairConfigAccountsJSON,
    ToggleAutoCreditAccountsJSON,
    TokenizeDripPositionAccountsJSON,
    UpdateAdminAccountsJSON,
    UpdateDefaultDripFeesAccountsJSON,
    UpdateDefaultDripFeesFieldsJSON,
    UpdatePythPriceFeedAccountsJSON,
    UpdateSuperAdminAccountsJSON,
} from '../generated/anchor/instructions';

////////////////////////////////////////////////////////////////
// Errors
////////////////////////////////////////////////////////////////

export class RestError extends Error {
    constructor(readonly status: number, readonly message: string) {
        super(`${status}: ${message ?? ''}`);
    }

    static invalid(message: string): RestError {
        return new RestError(400, message);
    }

    static notFound(message: string): RestError {
        return new RestError(404, message);
    }

    static unprocessable(message: string): RestError {
        return new RestError(422, message);
    }

    static internal(message: string): RestError {
        return new RestError(500, message);
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}

////////////////////////////////////////////////////////////////
// Parameters
////////////////////////////////////////////////////////////////

export type Commitment = 'confirmed' | 'finalized';

////////////////////////////////////////////////////////////////
// Responses
////////////////////////////////////////////////////////////////

export type PingResponse = {
    message: string;
};

export type ParsedAccountResponse = {
    // name:
    //     | 'DripPosition'
    //     | 'DripPositionNftMapping'
    //     | 'DripPositionSigner'
    //     | 'GlobalConfig'
    //     | 'GlobalConfigSigner'
    //     | 'PairConfig'
    // account:
    //     | DripPositionJSON
    //     | DripPositionNftMappingJSON
    //     | DripPositionSignerJSON
    //     | GlobalConfigJSON
    //     | GlobalConfigSignerJSON
    //     | PairConfigJSON
    publicKey: string;
    name: string;
    parsedDripPosition?: DripPositionJSONWrapper;
    parsedDripPositionNftMapping?: DripPositionNftMappingJSON;
    parsedDripPositionSigner?: DripPositionSignerJSON;
    parsedGlobalConfig?: GlobalConfigJSON;
    parsedGlobalConfigSigner?: GlobalConfigSignerJSON;
    parsedPairConfig?: PairConfigJSONWrapper;
};

export type ParsedTxResponse = {
    signature: string;
    instructions: ParsedDripIxWithIndex[];
};

////////////////////////////////////////////////////////////////
// Misc
////////////////////////////////////////////////////////////////

export type PriceOracleJSON = {
    priceOracleJsonIsUnavailable: boolean;
    priceOracleJsonIsPyth: boolean;
};
export type PairConfigJSONWrapper = Omit<
    PairConfigJSON,
    'inputTokenPriceOracle' | 'outputTokenPriceOracle'
> & {
    inputTokenPriceOracle: PriceOracleJSON;
    outputTokenPriceOracle: PriceOracleJSON;
};

export type DripPositionJSONWrapper = Omit<DripPositionJSON, 'owner'> & {
    ownerType: 'Direct' | 'Tokenized';
    owner: string | undefined;
};

export type ParsedDeposit = {
    name: DripV2InstructionNames.deposit;
    accounts: DepositAccountsJSON;
    data: DepositFieldsJSON;
};

export type ParsedDetokenizeDripPosition = {
    name: DripV2InstructionNames.detokenizeDripPosition;
    accounts: DetokenizeDripPositionAccountsJSON;
};

export type ParsedInitDripPosition = {
    name: DripV2InstructionNames.initDripPosition;
    accounts: InitDripPositionAccountsJSON;
    data: InitDripPositionFieldsJSON;
};

export type ParsedInitDripPositionNft = {
    name: DripV2InstructionNames.initDripPositionNft;
    accounts: InitDripPositionNftAccountsJSON;
};

export type ParsedInitGlobalConfig = {
    name: DripV2InstructionNames.initGlobalConfig;
    accounts: InitGlobalConfigAccountsJSON;
    data: InitGlobalConfigFieldsJSON;
};

export type ParsedInitPairConfig = {
    name: DripV2InstructionNames.initPairConfig;
    accounts: InitPairConfigAccountsJSON;
};

export type ParsedToggleAutoCredit = {
    name: DripV2InstructionNames.toggleAutoCredit;
    accounts: ToggleAutoCreditAccountsJSON;
};

export type ParsedTokenizeDripPosition = {
    name: DripV2InstructionNames.tokenizeDripPosition;
    accounts: TokenizeDripPositionAccountsJSON;
};

export type ParsedUpdateAdmin = {
    name: DripV2InstructionNames.updateAdmin;
    accounts: UpdateAdminAccountsJSON;
    // Note: openapi does not have support for tuples!
    data: unknown;
};

export type ParsedUpdateDefaultDripFees = {
    name: DripV2InstructionNames.updateDefaultDripFees;
    accounts: UpdateDefaultDripFeesAccountsJSON;
    data: UpdateDefaultDripFeesFieldsJSON;
};

export type ParsedUpdateDefaultPairDripFees = {
    name: DripV2InstructionNames.updateDefaultPairDripFees;

    accounts: UpdateDefaultPairDripFeesAccountsJSON;
    data: UpdateDefaultPairDripFeesFieldsJSON;
};

export type ParsedUpdatePythPriceFeed = {
    name: DripV2InstructionNames.updatePythPriceFeed;
    accounts: UpdatePythPriceFeedAccountsJSON;
};

export type ParsedUpdateSuperAdmin = {
    name: DripV2InstructionNames.updateSuperAdmin;
    accounts: UpdateSuperAdminAccountsJSON;
};

// export type ParsedDripIx =
//     | ParsedDeposit
//     | ParsedDetokenizeDripPosition
//     | ParsedInitDripPosition
//     | ParsedInitDripPositionNft
//     | ParsedInitGlobalConfig
//     | ParsedInitPairConfig
//     | ParsedToggleAutoCredit
//     | ParsedTokenizeDripPosition
//     | ParsedUpdateAdmin
//     | ParsedUpdateDefaultDripFees
//     | ParsedUpdateDefaultPairDripFees
//     | ParsedUpdatePythPriceFeed
//     | ParsedUpdateSuperAdmin

export type ParsedDripIxWithIndex = {
    index: number;
} & ParsedDripIx;

export type ParsedDripIx = {
    parsedDeposit?: ParsedDeposit;
    parsedDetokenizeDripPosition?: ParsedDetokenizeDripPosition;
    parsedInitDripPosition?: ParsedInitDripPosition;
    parsedInitDripPositionNft?: ParsedInitDripPositionNft;
    parsedInitGlobalConfig?: ParsedInitGlobalConfig;
    parsedInitPairConfig?: ParsedInitPairConfig;
    parsedToggleAutoCredit?: ParsedToggleAutoCredit;
    parsedTokenizeDripPosition?: ParsedTokenizeDripPosition;
    parsedUpdateAdmin?: ParsedUpdateAdmin;
    parsedUpdateDefaultDripFees?: ParsedUpdateDefaultDripFees;
    parsedUpdateDefaultPairDripFees?: ParsedUpdateDefaultPairDripFees;
    parsedUpdatePythPriceFeed?: ParsedUpdatePythPriceFeed;
    parsedUpdateSuperAdmin?: ParsedUpdateSuperAdmin;
};
