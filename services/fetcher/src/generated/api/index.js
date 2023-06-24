'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.RegisterRoutes = void 0
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require('@tsoa/runtime')
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const fetchController_1 = require('./../../controllers/fetchController')
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const pingController_1 = require('./../../controllers/pingController')
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    'DripV2InstructionNames.deposit': {
        dataType: 'refEnum',
        enums: ['deposit'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DepositAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            sourceInputTokenAccount: { dataType: 'string', required: true },
            dripPositionInputTokenAccount: {
                dataType: 'string',
                required: true,
            },
            dripPosition: { dataType: 'string', required: true },
            tokenProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.DepositParamsJSON': {
        dataType: 'refObject',
        properties: {
            depositAmount: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DepositFieldsJSON: {
        dataType: 'refObject',
        properties: {
            params: { ref: 'types.DepositParamsJSON', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDeposit: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'DepositFieldsJSON', required: true },
                accounts: { ref: 'DepositAccountsJSON', required: true },
                name: { ref: 'DripV2InstructionNames.deposit', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.detokenizeDripPosition': {
        dataType: 'refEnum',
        enums: ['detokenizeDripPosition'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DetokenizeDripPositionAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            owner: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
            dripPositionSigner: { dataType: 'string', required: true },
            dripPositionNftMint: { dataType: 'string', required: true },
            dripPositionNftAccount: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
            tokenProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDetokenizeDripPosition: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'DetokenizeDripPositionAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.detokenizeDripPosition',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.initDripPosition': {
        dataType: 'refEnum',
        enums: ['initDripPosition'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitDripPositionAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            owner: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
            inputTokenMint: { dataType: 'string', required: true },
            outputTokenMint: { dataType: 'string', required: true },
            inputTokenAccount: { dataType: 'string', required: true },
            outputTokenAccount: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
            dripPositionSigner: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
            tokenProgram: { dataType: 'string', required: true },
            associatedTokenProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.InitDripPositionParamsJSON': {
        dataType: 'refObject',
        properties: {
            dripAmount: { dataType: 'string', required: true },
            frequencyInSeconds: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitDripPositionFieldsJSON: {
        dataType: 'refObject',
        properties: {
            params: { ref: 'types.InitDripPositionParamsJSON', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitDripPosition: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'InitDripPositionFieldsJSON', required: true },
                accounts: {
                    ref: 'InitDripPositionAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.initDripPosition',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.initDripPositionNft': {
        dataType: 'refEnum',
        enums: ['initDripPositionNft'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitDripPositionNftAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
            dripPositionSigner: { dataType: 'string', required: true },
            dripPositionNftMint: { dataType: 'string', required: true },
            dripPositionNftMapping: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
            tokenProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitDripPositionNft: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'InitDripPositionNftAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.initDripPositionNft',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.initGlobalConfig': {
        dataType: 'refEnum',
        enums: ['initGlobalConfig'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitGlobalConfigAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
            globalConfigSigner: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.InitGlobalConfigParamsJSON': {
        dataType: 'refObject',
        properties: {
            superAdmin: { dataType: 'string', required: true },
            defaultDripFeeBps: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitGlobalConfigFieldsJSON: {
        dataType: 'refObject',
        properties: {
            params: { ref: 'types.InitGlobalConfigParamsJSON', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitGlobalConfig: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'InitGlobalConfigFieldsJSON', required: true },
                accounts: {
                    ref: 'InitGlobalConfigAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.initGlobalConfig',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.initPairConfig': {
        dataType: 'refEnum',
        enums: ['initPairConfig'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    InitPairConfigAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
            inputTokenMint: { dataType: 'string', required: true },
            outputTokenMint: { dataType: 'string', required: true },
            pairConfig: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitPairConfig: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: { ref: 'InitPairConfigAccountsJSON', required: true },
                name: {
                    ref: 'DripV2InstructionNames.initPairConfig',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.toggleAutoCredit': {
        dataType: 'refEnum',
        enums: ['toggleAutoCredit'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ToggleAutoCreditAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedToggleAutoCredit: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'ToggleAutoCreditAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.toggleAutoCredit',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.tokenizeDripPosition': {
        dataType: 'refEnum',
        enums: ['tokenizeDripPosition'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    TokenizeDripPositionAccountsJSON: {
        dataType: 'refObject',
        properties: {
            payer: { dataType: 'string', required: true },
            owner: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
            dripPositionSigner: { dataType: 'string', required: true },
            dripPositionNftMint: { dataType: 'string', required: true },
            dripPositionNftAccount: { dataType: 'string', required: true },
            systemProgram: { dataType: 'string', required: true },
            tokenProgram: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedTokenizeDripPosition: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'TokenizeDripPositionAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.tokenizeDripPosition',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.updateAdmin': {
        dataType: 'refEnum',
        enums: ['updateAdmin'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateAdminAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateAdmin: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'any', required: true },
                accounts: { ref: 'UpdateAdminAccountsJSON', required: true },
                name: {
                    ref: 'DripV2InstructionNames.updateAdmin',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.updateDefaultDripFees': {
        dataType: 'refEnum',
        enums: ['updateDefaultDripFees'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateDefaultDripFeesAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.UpdateDefaultDripFeesParamsJSON': {
        dataType: 'refObject',
        properties: {
            newDefaultDripFeesBps: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateDefaultDripFeesFieldsJSON: {
        dataType: 'refObject',
        properties: {
            params: {
                ref: 'types.UpdateDefaultDripFeesParamsJSON',
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateDefaultDripFees: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: {
                    ref: 'UpdateDefaultDripFeesFieldsJSON',
                    required: true,
                },
                accounts: {
                    ref: 'UpdateDefaultDripFeesAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.updateDefaultDripFees',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.updateDefaultPairDripFees': {
        dataType: 'refEnum',
        enums: ['updateDefaultPairDripFees'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateDefaultPairDripFeesAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            pairConfig: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.UpdateDefaultPairDripFeesParamsJSON': {
        dataType: 'refObject',
        properties: {
            newDefaultPairDripFeesBps: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateDefaultPairDripFeesFieldsJSON: {
        dataType: 'refObject',
        properties: {
            params: {
                ref: 'types.UpdateDefaultPairDripFeesParamsJSON',
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateDefaultPairDripFees: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: {
                    ref: 'UpdateDefaultPairDripFeesFieldsJSON',
                    required: true,
                },
                accounts: {
                    ref: 'UpdateDefaultPairDripFeesAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.updateDefaultPairDripFees',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.updatePythPriceFeed': {
        dataType: 'refEnum',
        enums: ['updatePythPriceFeed'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdatePythPriceFeedAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
            pairConfig: { dataType: 'string', required: true },
            inputTokenPythPriceFeed: { dataType: 'string', required: true },
            outputTokenPythPriceFeed: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdatePythPriceFeed: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'UpdatePythPriceFeedAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.updatePythPriceFeed',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.updateSuperAdmin': {
        dataType: 'refEnum',
        enums: ['updateSuperAdmin'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateSuperAdminAccountsJSON: {
        dataType: 'refObject',
        properties: {
            signer: { dataType: 'string', required: true },
            newSuperAdmin: { dataType: 'string', required: true },
            globalConfig: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateSuperAdmin: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                accounts: {
                    ref: 'UpdateSuperAdminAccountsJSON',
                    required: true,
                },
                name: {
                    ref: 'DripV2InstructionNames.updateSuperAdmin',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDripIx: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                parsedUpdateSuperAdmin: { ref: 'ParsedUpdateSuperAdmin' },
                parsedUpdatePythPriceFeed: { ref: 'ParsedUpdatePythPriceFeed' },
                parsedUpdateDefaultPairDripFees: {
                    ref: 'ParsedUpdateDefaultPairDripFees',
                },
                parsedUpdateDefaultDripFees: {
                    ref: 'ParsedUpdateDefaultDripFees',
                },
                parsedUpdateAdmin: { ref: 'ParsedUpdateAdmin' },
                parsedTokenizeDripPosition: {
                    ref: 'ParsedTokenizeDripPosition',
                },
                parsedToggleAutoCredit: { ref: 'ParsedToggleAutoCredit' },
                parsedInitPairConfig: { ref: 'ParsedInitPairConfig' },
                parsedInitGlobalConfig: { ref: 'ParsedInitGlobalConfig' },
                parsedInitDripPositionNft: { ref: 'ParsedInitDripPositionNft' },
                parsedInitDripPosition: { ref: 'ParsedInitDripPosition' },
                parsedDetokenizeDripPosition: {
                    ref: 'ParsedDetokenizeDripPosition',
                },
                parsedDeposit: { ref: 'ParsedDeposit' },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDripIxWithIndex: {
        dataType: 'refAlias',
        type: {
            dataType: 'intersection',
            subSchemas: [
                {
                    dataType: 'nestedObjectLiteral',
                    nestedProperties: {
                        index: { dataType: 'double', required: true },
                    },
                },
                { ref: 'ParsedDripIx' },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedTxResponse: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                instructions: {
                    dataType: 'array',
                    array: {
                        dataType: 'refAlias',
                        ref: 'ParsedDripIxWithIndex',
                    },
                    required: true,
                },
                signature: { dataType: 'string', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    RestError: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                message: { dataType: 'string', required: true },
                status: { dataType: 'double', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Commitment: {
        dataType: 'refAlias',
        type: {
            dataType: 'union',
            subSchemas: [
                { dataType: 'enum', enums: ['confirmed'] },
                { dataType: 'enum', enums: ['finalized'] },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'Pick_DripPositionJSON.Exclude_keyofDripPositionJSON.owner__': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                globalConfig: { dataType: 'string', required: true },
                dripPositionSigner: { dataType: 'string', required: true },
                autoCreditEnabled: { dataType: 'boolean', required: true },
                inputTokenMint: { dataType: 'string', required: true },
                outputTokenMint: { dataType: 'string', required: true },
                inputTokenAccount: { dataType: 'string', required: true },
                outputTokenAccount: { dataType: 'string', required: true },
                dripAmount: { dataType: 'string', required: true },
                frequencyInSeconds: { dataType: 'string', required: true },
                totalInputTokenDripped: { dataType: 'string', required: true },
                totalOutputTokenReceived: {
                    dataType: 'string',
                    required: true,
                },
                dripPositionNftMint: {
                    dataType: 'union',
                    subSchemas: [
                        { dataType: 'string' },
                        { dataType: 'enum', enums: [null] },
                    ],
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'Omit_DripPositionJSON.owner_': {
        dataType: 'refAlias',
        type: {
            ref: 'Pick_DripPositionJSON.Exclude_keyofDripPositionJSON.owner__',
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DripPositionJSONWrapper: {
        dataType: 'refAlias',
        type: {
            dataType: 'intersection',
            subSchemas: [
                { ref: 'Omit_DripPositionJSON.owner_' },
                {
                    dataType: 'nestedObjectLiteral',
                    nestedProperties: {
                        ownerIsDirect: { dataType: 'boolean', required: true },
                        ownerIsTokenized: {
                            dataType: 'boolean',
                            required: true,
                        },
                    },
                },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DripPositionNftMappingJSON: {
        dataType: 'refObject',
        properties: {
            version: { dataType: 'double', required: true },
            dripPositionNftMint: { dataType: 'string', required: true },
            dripPosition: { dataType: 'string', required: true },
            bump: { dataType: 'double', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DripPositionSignerJSON: {
        dataType: 'refObject',
        properties: {
            version: { dataType: 'double', required: true },
            dripPosition: { dataType: 'string', required: true },
            bump: { dataType: 'double', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    GlobalConfigJSON: {
        dataType: 'refObject',
        properties: {
            version: { dataType: 'double', required: true },
            superAdmin: { dataType: 'string', required: true },
            admins: {
                dataType: 'array',
                array: { dataType: 'string' },
                required: true,
            },
            adminPermissions: {
                dataType: 'array',
                array: { dataType: 'string' },
                required: true,
            },
            defaultDripFeeBps: { dataType: 'string', required: true },
            globalConfigSigner: { dataType: 'string', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    GlobalConfigSignerJSON: {
        dataType: 'refObject',
        properties: {
            version: { dataType: 'double', required: true },
            globalConfig: { dataType: 'string', required: true },
            bump: { dataType: 'double', required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'Pick_PairConfigJSON.Exclude_keyofPairConfigJSON.inputTokenPriceOracle-or-outputTokenPriceOracle__':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'nestedObjectLiteral',
                nestedProperties: {
                    globalConfig: { dataType: 'string', required: true },
                    inputTokenMint: { dataType: 'string', required: true },
                    outputTokenMint: { dataType: 'string', required: true },
                    version: { dataType: 'double', required: true },
                    bump: { dataType: 'double', required: true },
                    defaultPairDripFeeBps: {
                        dataType: 'string',
                        required: true,
                    },
                    inputTokenDripFeePortionBps: {
                        dataType: 'string',
                        required: true,
                    },
                },
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'Omit_PairConfigJSON.inputTokenPriceOracle-or-outputTokenPriceOracle_': {
        dataType: 'refAlias',
        type: {
            ref: 'Pick_PairConfigJSON.Exclude_keyofPairConfigJSON.inputTokenPriceOracle-or-outputTokenPriceOracle__',
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    PriceOracleJSON: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                priceOracleJsonIsPyth: { dataType: 'boolean', required: true },
                priceOracleJsonIsUnavailable: {
                    dataType: 'boolean',
                    required: true,
                },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    PairConfigJSONWrapper: {
        dataType: 'refAlias',
        type: {
            dataType: 'intersection',
            subSchemas: [
                {
                    ref: 'Omit_PairConfigJSON.inputTokenPriceOracle-or-outputTokenPriceOracle_',
                },
                {
                    dataType: 'nestedObjectLiteral',
                    nestedProperties: {
                        outputTokenPriceOracle: {
                            ref: 'PriceOracleJSON',
                            required: true,
                        },
                        inputTokenPriceOracle: {
                            ref: 'PriceOracleJSON',
                            required: true,
                        },
                    },
                },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedAccountResponse: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                parsedPairConfig: { ref: 'PairConfigJSONWrapper' },
                parsedGlobalConfigSigner: { ref: 'GlobalConfigSignerJSON' },
                parsedGlobalConfig: { ref: 'GlobalConfigJSON' },
                parsedDripPositionSigner: { ref: 'DripPositionSignerJSON' },
                parsedDripPositionNftMapping: {
                    ref: 'DripPositionNftMappingJSON',
                },
                parsedDripPosition: { ref: 'DripPositionJSONWrapper' },
                name: { dataType: 'string', required: true },
                publicKey: { dataType: 'string', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    PingResponse: {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                message: { dataType: 'string', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
const validationService = new runtime_1.ValidationService(models)
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get(
        '/fetch/tx/:signature',
        ...(0, runtime_1.fetchMiddlewares)(fetchController_1.FetchController),
        ...(0, runtime_1.fetchMiddlewares)(
            fetchController_1.FetchController.prototype.parseTx
        ),
        function FetchController_parseTx(request, response, next) {
            const args = {
                signature: {
                    in: 'path',
                    name: 'signature',
                    required: true,
                    dataType: 'string',
                },
                commitment: {
                    default: 'finalized',
                    in: 'query',
                    name: 'commitment',
                    ref: 'Commitment',
                },
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)
                const controller = new fetchController_1.FetchController()
                const promise = controller.parseTx.apply(
                    controller,
                    validatedArgs
                )
                promiseHandler(controller, promise, response, 200, next)
            } catch (err) {
                return next(err)
            }
        }
    )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get(
        '/fetch/account/:accountPublicKey',
        ...(0, runtime_1.fetchMiddlewares)(fetchController_1.FetchController),
        ...(0, runtime_1.fetchMiddlewares)(
            fetchController_1.FetchController.prototype.parseAccount
        ),
        function FetchController_parseAccount(request, response, next) {
            const args = {
                accountPublicKeyStr: {
                    in: 'path',
                    name: 'accountPublicKey',
                    required: true,
                    dataType: 'string',
                },
                commitment: {
                    default: 'finalized',
                    in: 'query',
                    name: 'commitment',
                    ref: 'Commitment',
                },
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)
                const controller = new fetchController_1.FetchController()
                const promise = controller.parseAccount.apply(
                    controller,
                    validatedArgs
                )
                promiseHandler(controller, promise, response, 200, next)
            } catch (err) {
                return next(err)
            }
        }
    )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get(
        '/',
        ...(0, runtime_1.fetchMiddlewares)(pingController_1.PingController),
        ...(0, runtime_1.fetchMiddlewares)(
            pingController_1.PingController.prototype.ping
        ),
        function PingController_ping(request, response, next) {
            const args = {}
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            let validatedArgs = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)
                const controller = new pingController_1.PingController()
                const promise = controller.ping.apply(controller, validatedArgs)
                promiseHandler(controller, promise, response, undefined, next)
            } catch (err) {
                return next(err)
            }
        }
    )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return (
            'getHeaders' in object &&
            'getStatus' in object &&
            'setStatus' in object
        )
    }
    function promiseHandler(
        controllerObj,
        promise,
        response,
        successStatus,
        next
    ) {
        return Promise.resolve(promise)
            .then((data) => {
                let statusCode = successStatus
                let headers
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders()
                    statusCode = controllerObj.getStatus() || statusCode
                }
                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
                returnHandler(response, statusCode, data, headers)
            })
            .catch((error) => next(error))
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name])
        })
        if (
            data &&
            typeof data.pipe === 'function' &&
            data.readable &&
            typeof data._read === 'function'
        ) {
            response.status(statusCode || 200)
            data.pipe(response)
        } else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data)
        } else {
            response.status(statusCode || 204).end()
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers)
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {}
        const values = Object.keys(args).map((key) => {
            const name = args[key].name
            switch (args[key].in) {
                case 'request':
                    return request
                case 'query':
                    return validationService.ValidateParam(
                        args[key],
                        request.query[name],
                        name,
                        fieldErrors,
                        undefined,
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'queries':
                    return validationService.ValidateParam(
                        args[key],
                        request.query,
                        name,
                        fieldErrors,
                        undefined,
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'path':
                    return validationService.ValidateParam(
                        args[key],
                        request.params[name],
                        name,
                        fieldErrors,
                        undefined,
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'header':
                    return validationService.ValidateParam(
                        args[key],
                        request.header(name),
                        name,
                        fieldErrors,
                        undefined,
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'body':
                    return validationService.ValidateParam(
                        args[key],
                        request.body,
                        name,
                        fieldErrors,
                        undefined,
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'body-prop':
                    return validationService.ValidateParam(
                        args[key],
                        request.body[name],
                        name,
                        fieldErrors,
                        'body.',
                        { noImplicitAdditionalProperties: 'throw-on-extras' }
                    )
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(
                            args[key],
                            request.file,
                            name,
                            fieldErrors,
                            undefined,
                            {
                                noImplicitAdditionalProperties:
                                    'throw-on-extras',
                            }
                        )
                    } else if (
                        args[key].dataType === 'array' &&
                        args[key].array.dataType === 'file'
                    ) {
                        return validationService.ValidateParam(
                            args[key],
                            request.files,
                            name,
                            fieldErrors,
                            undefined,
                            {
                                noImplicitAdditionalProperties:
                                    'throw-on-extras',
                            }
                        )
                    } else {
                        return validationService.ValidateParam(
                            args[key],
                            request.body[name],
                            name,
                            fieldErrors,
                            undefined,
                            {
                                noImplicitAdditionalProperties:
                                    'throw-on-extras',
                            }
                        )
                    }
                case 'res':
                    return responder(response)
            }
        })
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '')
        }
        return values
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
//# sourceMappingURL=index.js.map
