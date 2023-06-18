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
import { ParseController } from './../../controllers/parseController'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PingController } from './../../controllers/pingController'
import type { RequestHandler, Router } from 'express'

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
}
const validationService = new ValidationService(models)

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.get(
        '/parse/tx/:txSignature',
        ...fetchMiddlewares<RequestHandler>(ParseController),
        ...fetchMiddlewares<RequestHandler>(ParseController.prototype.parseTx),

        function ParseController_parseTx(
            request: any,
            response: any,
            next: any
        ) {
            const args = {
                txSignature: {
                    in: 'path',
                    name: 'txSignature',
                    required: true,
                    dataType: 'string',
                },
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)

                const controller = new ParseController()

                const promise = controller.parseTx.apply(
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
    app.get(
        '/parse/account/:accountPublicKey',
        ...fetchMiddlewares<RequestHandler>(ParseController),
        ...fetchMiddlewares<RequestHandler>(
            ParseController.prototype.parseAccount
        ),

        function ParseController_parseAccount(
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
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = []
            try {
                validatedArgs = getValidatedArgs(args, request, response)

                const controller = new ParseController()

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
