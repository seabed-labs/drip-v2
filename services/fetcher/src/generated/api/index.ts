/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {
    Controller,
    ValidationService,
    FieldErrors,
    ValidateError,
    TsoaRoute,
    HttpStatusCodeLiteral,
    TsoaResponse,
    fetchMiddlewares,
} from '@tsoa/runtime'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FetchController } from './../../controllers/fetchController'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController } from './../../controllers/pingController'
import type { RequestHandler, Router } from 'express'

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
    'ParsedIx_DepositAccountsJSON.DepositFieldsJSON_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'DepositFieldsJSON', required: true },
                accounts: { ref: 'DepositAccountsJSON', required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripV2InstructionNames.deposit': {
        dataType: 'refEnum',
        enums: ['deposit'],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'ParsedIxWithMetadata_DepositAccountsJSON.DripV2InstructionNames.deposit.DepositFieldsJSON_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    { ref: 'ParsedIx_DepositAccountsJSON.DepositFieldsJSON_' },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.deposit',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDeposit: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_DepositAccountsJSON.DripV2InstructionNames.deposit.DepositFieldsJSON_',
            validators: {},
        },
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
    'ParsedIx_DetokenizeDripPositionAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'DetokenizeDripPositionAccountsJSON',
                    required: true,
                },
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
    'ParsedIxWithMetadata_DetokenizeDripPositionAccountsJSON.DripV2InstructionNames.detokenizeDripPosition_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_DetokenizeDripPositionAccountsJSON.undefined_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.detokenizeDripPosition',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDetokenizeDripPosition: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_DetokenizeDripPositionAccountsJSON.DripV2InstructionNames.detokenizeDripPosition_',
            validators: {},
        },
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
    'ParsedIx_InitDripPositionAccountsJSON.InitDripPositionFieldsJSON_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'InitDripPositionFieldsJSON', required: true },
                accounts: {
                    ref: 'InitDripPositionAccountsJSON',
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
    'ParsedIxWithMetadata_InitDripPositionAccountsJSON.DripV2InstructionNames.initDripPosition.InitDripPositionFieldsJSON_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_InitDripPositionAccountsJSON.InitDripPositionFieldsJSON_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.initDripPosition',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitDripPosition: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_InitDripPositionAccountsJSON.DripV2InstructionNames.initDripPosition.InitDripPositionFieldsJSON_',
            validators: {},
        },
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
    'ParsedIx_InitDripPositionNftAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'InitDripPositionNftAccountsJSON',
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
    'ParsedIxWithMetadata_InitDripPositionNftAccountsJSON.DripV2InstructionNames.initDripPositionNft_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_InitDripPositionNftAccountsJSON.undefined_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.initDripPositionNft',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitDripPositionNft: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_InitDripPositionNftAccountsJSON.DripV2InstructionNames.initDripPositionNft_',
            validators: {},
        },
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
    'ParsedIx_InitGlobalConfigAccountsJSON.InitGlobalConfigFieldsJSON_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'InitGlobalConfigFieldsJSON', required: true },
                accounts: {
                    ref: 'InitGlobalConfigAccountsJSON',
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
    'ParsedIxWithMetadata_InitGlobalConfigAccountsJSON.DripV2InstructionNames.initGlobalConfig.InitGlobalConfigFieldsJSON_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_InitGlobalConfigAccountsJSON.InitGlobalConfigFieldsJSON_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.initGlobalConfig',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitGlobalConfig: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_InitGlobalConfigAccountsJSON.DripV2InstructionNames.initGlobalConfig.InitGlobalConfigFieldsJSON_',
            validators: {},
        },
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
    'ParsedIx_InitPairConfigAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: { ref: 'InitPairConfigAccountsJSON', required: true },
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
    'ParsedIxWithMetadata_InitPairConfigAccountsJSON.DripV2InstructionNames.initPairConfig_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    { ref: 'ParsedIx_InitPairConfigAccountsJSON.undefined_' },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.initPairConfig',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedInitPairConfig: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_InitPairConfigAccountsJSON.DripV2InstructionNames.initPairConfig_',
            validators: {},
        },
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
    'ParsedIx_ToggleAutoCreditAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'ToggleAutoCreditAccountsJSON',
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
    'ParsedIxWithMetadata_ToggleAutoCreditAccountsJSON.DripV2InstructionNames.toggleAutoCredit_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    { ref: 'ParsedIx_ToggleAutoCreditAccountsJSON.undefined_' },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.toggleAutoCredit',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedToggleAutoCredit: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_ToggleAutoCreditAccountsJSON.DripV2InstructionNames.toggleAutoCredit_',
            validators: {},
        },
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
    'ParsedIx_TokenizeDripPositionAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'TokenizeDripPositionAccountsJSON',
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
    'ParsedIxWithMetadata_TokenizeDripPositionAccountsJSON.DripV2InstructionNames.tokenizeDripPosition_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_TokenizeDripPositionAccountsJSON.undefined_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.tokenizeDripPosition',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedTokenizeDripPosition: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_TokenizeDripPositionAccountsJSON.DripV2InstructionNames.tokenizeDripPosition_',
            validators: {},
        },
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
    'Record_string.unknown_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {},
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'ParsedIx_UpdateAdminAccountsJSON.Record_string.unknown__': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { ref: 'Record_string.unknown_', required: true },
                accounts: { ref: 'UpdateAdminAccountsJSON', required: true },
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
    'ParsedIxWithMetadata_UpdateAdminAccountsJSON.DripV2InstructionNames.updateAdmin.%2F%2FNote-openapidoesnothavesupportfortuples!Record_string.unknown__':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_UpdateAdminAccountsJSON.Record_string.unknown__',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.updateAdmin',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateAdmin: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_UpdateAdminAccountsJSON.DripV2InstructionNames.updateAdmin.%2F%2FNote-openapidoesnothavesupportfortuples!Record_string.unknown__',
            validators: {},
        },
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
    'ParsedIx_UpdateDefaultDripFeesAccountsJSON.UpdateDefaultDripFeesFieldsJSON_':
        {
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
    'ParsedIxWithMetadata_UpdateDefaultDripFeesAccountsJSON.DripV2InstructionNames.updateDefaultDripFees.UpdateDefaultDripFeesFieldsJSON_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_UpdateDefaultDripFeesAccountsJSON.UpdateDefaultDripFeesFieldsJSON_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.updateDefaultDripFees',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateDefaultDripFees: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_UpdateDefaultDripFeesAccountsJSON.DripV2InstructionNames.updateDefaultDripFees.UpdateDefaultDripFeesFieldsJSON_',
            validators: {},
        },
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
    'ParsedIx_UpdateDefaultPairDripFeesAccountsJSON.UpdateDefaultPairDripFeesFieldsJSON_':
        {
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
    'ParsedIxWithMetadata_UpdateDefaultPairDripFeesAccountsJSON.DripV2InstructionNames.updateDefaultPairDripFees.UpdateDefaultPairDripFeesFieldsJSON_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_UpdateDefaultPairDripFeesAccountsJSON.UpdateDefaultPairDripFeesFieldsJSON_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.updateDefaultPairDripFees',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateDefaultPairDripFees: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_UpdateDefaultPairDripFeesAccountsJSON.DripV2InstructionNames.updateDefaultPairDripFees.UpdateDefaultPairDripFeesFieldsJSON_',
            validators: {},
        },
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
    'ParsedIx_UpdatePythPriceFeedAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'UpdatePythPriceFeedAccountsJSON',
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
    'ParsedIxWithMetadata_UpdatePythPriceFeedAccountsJSON.DripV2InstructionNames.updatePythPriceFeed_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    {
                        ref: 'ParsedIx_UpdatePythPriceFeedAccountsJSON.undefined_',
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.updatePythPriceFeed',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdatePythPriceFeed: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_UpdatePythPriceFeedAccountsJSON.DripV2InstructionNames.updatePythPriceFeed_',
            validators: {},
        },
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
    'ParsedIx_UpdateSuperAdminAccountsJSON.undefined_': {
        dataType: 'refAlias',
        type: {
            dataType: 'nestedObjectLiteral',
            nestedProperties: {
                data: { dataType: 'undefined', required: true },
                accounts: {
                    ref: 'UpdateSuperAdminAccountsJSON',
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
    'ParsedIxWithMetadata_UpdateSuperAdminAccountsJSON.DripV2InstructionNames.updateSuperAdmin_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'intersection',
                subSchemas: [
                    { ref: 'ParsedIx_UpdateSuperAdminAccountsJSON.undefined_' },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            index: { dataType: 'double', required: true },
                            name: {
                                ref: 'DripV2InstructionNames.updateSuperAdmin',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedUpdateSuperAdmin: {
        dataType: 'refAlias',
        type: {
            ref: 'ParsedIxWithMetadata_UpdateSuperAdminAccountsJSON.DripV2InstructionNames.updateSuperAdmin_',
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedDripIx: {
        dataType: 'refAlias',
        type: {
            dataType: 'union',
            subSchemas: [
                { ref: 'ParsedDeposit' },
                { ref: 'ParsedDetokenizeDripPosition' },
                { ref: 'ParsedInitDripPosition' },
                { ref: 'ParsedInitDripPositionNft' },
                { ref: 'ParsedInitGlobalConfig' },
                { ref: 'ParsedInitPairConfig' },
                { ref: 'ParsedToggleAutoCredit' },
                { ref: 'ParsedTokenizeDripPosition' },
                { ref: 'ParsedUpdateAdmin' },
                { ref: 'ParsedUpdateDefaultDripFees' },
                { ref: 'ParsedUpdateDefaultPairDripFees' },
                { ref: 'ParsedUpdatePythPriceFeed' },
                { ref: 'ParsedUpdateSuperAdmin' },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Error: {
        dataType: 'refObject',
        properties: {
            name: { dataType: 'string', required: true },
            message: { dataType: 'string', required: true },
            stack: { dataType: 'string' },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'ResponseCommon__signature-stringparsedInstructions%3A_index-numberparsedIx%3AParsedDripIx_-ArrayunparsedInstructions-number-Array_.Error_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'union',
                subSchemas: [
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            error: { ref: 'Error' },
                            data: {
                                dataType: 'nestedObjectLiteral',
                                nestedProperties: {
                                    unparsedInstructions: {
                                        dataType: 'array',
                                        array: { dataType: 'double' },
                                        required: true,
                                    },
                                    parsedInstructions: {
                                        dataType: 'array',
                                        array: {
                                            dataType: 'nestedObjectLiteral',
                                            nestedProperties: {
                                                parsedIx: {
                                                    ref: 'ParsedDripIx',
                                                    required: true,
                                                },
                                                index: {
                                                    dataType: 'double',
                                                    required: true,
                                                },
                                            },
                                        },
                                        required: true,
                                    },
                                    signature: {
                                        dataType: 'string',
                                        required: true,
                                    },
                                },
                                required: true,
                            },
                            serverTimestamp: {
                                dataType: 'double',
                                required: true,
                            },
                        },
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            error: { ref: 'Error', required: true },
                            data: {
                                dataType: 'nestedObjectLiteral',
                                nestedProperties: {
                                    unparsedInstructions: {
                                        dataType: 'array',
                                        array: { dataType: 'double' },
                                        required: true,
                                    },
                                    parsedInstructions: {
                                        dataType: 'array',
                                        array: {
                                            dataType: 'nestedObjectLiteral',
                                            nestedProperties: {
                                                parsedIx: {
                                                    ref: 'ParsedDripIx',
                                                    required: true,
                                                },
                                                index: {
                                                    dataType: 'double',
                                                    required: true,
                                                },
                                            },
                                        },
                                        required: true,
                                    },
                                    signature: {
                                        dataType: 'string',
                                        required: true,
                                    },
                                },
                            },
                            serverTimestamp: {
                                dataType: 'double',
                                required: true,
                            },
                        },
                    },
                ],
                validators: {},
            },
        },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ParsedTxResponse: {
        dataType: 'refAlias',
        type: {
            ref: 'ResponseCommon__signature-stringparsedInstructions%3A_index-numberparsedIx%3AParsedDripIx_-ArrayunparsedInstructions-number-Array_.Error_',
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
    'DripPositionOwner.DirectJSON': {
        dataType: 'refObject',
        properties: {
            kind: { dataType: 'enum', enums: ['Direct'], required: true },
            value: {
                dataType: 'nestedObjectLiteral',
                nestedProperties: {
                    owner: { dataType: 'string', required: true },
                },
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'DripPositionOwner.TokenizedJSON': {
        dataType: 'refObject',
        properties: {
            kind: { dataType: 'enum', enums: ['Tokenized'], required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.DripPositionOwnerJSON': {
        dataType: 'refAlias',
        type: {
            dataType: 'union',
            subSchemas: [
                { ref: 'DripPositionOwner.DirectJSON' },
                { ref: 'DripPositionOwner.TokenizedJSON' },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    DripPositionJSON: {
        dataType: 'refObject',
        properties: {
            globalConfig: { dataType: 'string', required: true },
            owner: { ref: 'types.DripPositionOwnerJSON', required: true },
            dripPositionSigner: { dataType: 'string', required: true },
            autoCreditEnabled: { dataType: 'boolean', required: true },
            inputTokenMint: { dataType: 'string', required: true },
            outputTokenMint: { dataType: 'string', required: true },
            inputTokenAccount: { dataType: 'string', required: true },
            outputTokenAccount: { dataType: 'string', required: true },
            dripAmount: { dataType: 'string', required: true },
            frequencyInSeconds: { dataType: 'string', required: true },
            totalInputTokenDripped: { dataType: 'string', required: true },
            totalOutputTokenReceived: { dataType: 'string', required: true },
            dripPositionNftMint: {
                dataType: 'union',
                subSchemas: [
                    { dataType: 'string' },
                    { dataType: 'enum', enums: [null] },
                ],
                required: true,
            },
        },
        additionalProperties: false,
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
    'PriceOracle.UnavailableJSON': {
        dataType: 'refObject',
        properties: {
            kind: { dataType: 'enum', enums: ['Unavailable'], required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'PriceOracle.PythJSON': {
        dataType: 'refObject',
        properties: {
            kind: { dataType: 'enum', enums: ['Pyth'], required: true },
            value: {
                dataType: 'nestedObjectLiteral',
                nestedProperties: {
                    pythPriceFeedAccount: {
                        dataType: 'string',
                        required: true,
                    },
                },
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'types.PriceOracleJSON': {
        dataType: 'refAlias',
        type: {
            dataType: 'union',
            subSchemas: [
                { ref: 'PriceOracle.UnavailableJSON' },
                { ref: 'PriceOracle.PythJSON' },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    PairConfigJSON: {
        dataType: 'refObject',
        properties: {
            version: { dataType: 'double', required: true },
            globalConfig: { dataType: 'string', required: true },
            inputTokenMint: { dataType: 'string', required: true },
            outputTokenMint: { dataType: 'string', required: true },
            bump: { dataType: 'double', required: true },
            defaultPairDripFeeBps: { dataType: 'string', required: true },
            inputTokenDripFeePortionBps: { dataType: 'string', required: true },
            inputTokenPriceOracle: {
                ref: 'types.PriceOracleJSON',
                required: true,
            },
            outputTokenPriceOracle: {
                ref: 'types.PriceOracleJSON',
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'ResponseCommon__publicKey-stringname%3A-or-DripPosition-or-DripPositionNftMapping-or-DripPositionSigner-or-GlobalConfig-or-GlobalConfigSigner-or-PairConfigaccount%3A-or-DripPositionJSON-or-DripPositionNftMappingJSON-or-DripPositionSignerJSON-or-GlobalConfigJSON-or-GlobalConfigSignerJSON-or-PairConfigJSON_.Error_':
        {
            dataType: 'refAlias',
            type: {
                dataType: 'union',
                subSchemas: [
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            error: { ref: 'Error' },
                            data: {
                                dataType: 'nestedObjectLiteral',
                                nestedProperties: {
                                    account: {
                                        dataType: 'union',
                                        subSchemas: [
                                            { ref: 'DripPositionJSON' },
                                            {
                                                ref: 'DripPositionNftMappingJSON',
                                            },
                                            { ref: 'DripPositionSignerJSON' },
                                            { ref: 'GlobalConfigJSON' },
                                            { ref: 'GlobalConfigSignerJSON' },
                                            { ref: 'PairConfigJSON' },
                                        ],
                                        required: true,
                                    },
                                    name: {
                                        dataType: 'union',
                                        subSchemas: [
                                            {
                                                dataType: 'enum',
                                                enums: ['DripPosition'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: [
                                                    'DripPositionNftMapping',
                                                ],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['DripPositionSigner'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['GlobalConfig'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['GlobalConfigSigner'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['PairConfig'],
                                            },
                                        ],
                                        required: true,
                                    },
                                    publicKey: {
                                        dataType: 'string',
                                        required: true,
                                    },
                                },
                                required: true,
                            },
                            serverTimestamp: {
                                dataType: 'double',
                                required: true,
                            },
                        },
                    },
                    {
                        dataType: 'nestedObjectLiteral',
                        nestedProperties: {
                            error: { ref: 'Error', required: true },
                            data: {
                                dataType: 'nestedObjectLiteral',
                                nestedProperties: {
                                    account: {
                                        dataType: 'union',
                                        subSchemas: [
                                            { ref: 'DripPositionJSON' },
                                            {
                                                ref: 'DripPositionNftMappingJSON',
                                            },
                                            { ref: 'DripPositionSignerJSON' },
                                            { ref: 'GlobalConfigJSON' },
                                            { ref: 'GlobalConfigSignerJSON' },
                                            { ref: 'PairConfigJSON' },
                                        ],
                                        required: true,
                                    },
                                    name: {
                                        dataType: 'union',
                                        subSchemas: [
                                            {
                                                dataType: 'enum',
                                                enums: ['DripPosition'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: [
                                                    'DripPositionNftMapping',
                                                ],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['DripPositionSigner'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['GlobalConfig'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['GlobalConfigSigner'],
                                            },
                                            {
                                                dataType: 'enum',
                                                enums: ['PairConfig'],
                                            },
                                        ],
                                        required: true,
                                    },
                                    publicKey: {
                                        dataType: 'string',
                                        required: true,
                                    },
                                },
                            },
                            serverTimestamp: {
                                dataType: 'double',
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
            ref: 'ResponseCommon__publicKey-stringname%3A-or-DripPosition-or-DripPositionNftMapping-or-DripPositionSigner-or-GlobalConfig-or-GlobalConfigSigner-or-PairConfigaccount%3A-or-DripPositionJSON-or-DripPositionNftMappingJSON-or-DripPositionSignerJSON-or-GlobalConfigJSON-or-GlobalConfigSignerJSON-or-PairConfigJSON_.Error_',
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    'ResponseCommon__message-string_.Error_': {
        dataType: 'refAlias',
        type: {
            dataType: 'union',
            subSchemas: [
                {
                    dataType: 'nestedObjectLiteral',
                    nestedProperties: {
                        error: { ref: 'Error' },
                        data: {
                            dataType: 'nestedObjectLiteral',
                            nestedProperties: {
                                message: { dataType: 'string', required: true },
                            },
                            required: true,
                        },
                        serverTimestamp: { dataType: 'double', required: true },
                    },
                },
                {
                    dataType: 'nestedObjectLiteral',
                    nestedProperties: {
                        error: { ref: 'Error', required: true },
                        data: {
                            dataType: 'nestedObjectLiteral',
                            nestedProperties: {
                                message: { dataType: 'string', required: true },
                            },
                        },
                        serverTimestamp: { dataType: 'double', required: true },
                    },
                },
            ],
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    PingResponse: {
        dataType: 'refAlias',
        type: { ref: 'ResponseCommon__message-string_.Error_', validators: {} },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
const validationService = new ValidationService(models)

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get(
        '/fetch/tx/:signature',
        ...fetchMiddlewares<RequestHandler>(FetchController),
        ...fetchMiddlewares<RequestHandler>(FetchController.prototype.parseTx),

        function FetchController_parseTx(
            request: any,
            response: any,
            next: any
        ) {
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

            let validatedArgs: any[] = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)

                const controller = new FetchController()

                const promise = controller.parseTx.apply(
                    controller,
                    validatedArgs as any
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
        ...fetchMiddlewares<RequestHandler>(FetchController),
        ...fetchMiddlewares<RequestHandler>(
            FetchController.prototype.parseAccount
        ),

        function FetchController_parseAccount(
            request: any,
            response: any,
            next: any
        ) {
            const args = {
                accountPublicKey: {
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

            let validatedArgs: any[] = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)

                const controller = new FetchController()

                const promise = controller.parseAccount.apply(
                    controller,
                    validatedArgs as any
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
        ...fetchMiddlewares<RequestHandler>(PingController),
        ...fetchMiddlewares<RequestHandler>(PingController.prototype.ping),

        function PingController_ping(request: any, response: any, next: any) {
            const args = {}

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)

                const controller = new PingController()

                const promise = controller.ping.apply(
                    controller,
                    validatedArgs as any
                )
                promiseHandler(controller, promise, response, undefined, next)
            } catch (err) {
                return next(err)
            }
        }
    )
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function isController(object: any): object is Controller {
        return (
            'getHeaders' in object &&
            'getStatus' in object &&
            'setStatus' in object
        )
    }

    function promiseHandler(
        controllerObj: any,
        promise: any,
        response: any,
        successStatus: any,
        next: any
    ) {
        return Promise.resolve(promise)
            .then((data: any) => {
                let statusCode = successStatus
                let headers
                if (isController(controllerObj)) {
                    headers = controllerObj.getHeaders()
                    statusCode = controllerObj.getStatus() || statusCode
                }

                // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                returnHandler(response, statusCode, data, headers)
            })
            .catch((error: any) => next(error))
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function returnHandler(
        response: any,
        statusCode?: number,
        data?: any,
        headers: any = {}
    ) {
        if (response.headersSent) {
            return
        }
        Object.keys(headers).forEach((name: string) => {
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

    function responder(
        response: any
    ): TsoaResponse<HttpStatusCodeLiteral, unknown> {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers)
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function getValidatedArgs(args: any, request: any, response: any): any[] {
        const fieldErrors: FieldErrors = {}
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
            throw new ValidateError(fieldErrors, '')
        }
        return values
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
