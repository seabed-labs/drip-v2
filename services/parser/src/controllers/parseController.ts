import { Controller, Get, Path, Route, SuccessResponse } from 'tsoa'
import { getServerResponseCommon } from './common'
import { ParsedAccountResponse, PingResponse } from './types'
import { Connection, InvalidOwnerError } from '../service/solana'
import {
    DripAccountDecodeResponse,
    InvalidAccountError,
    tryDecodeToParsedDripAccount,
} from '../service/parser'
import { programId } from '../service/programId'
import { PublicKey } from '@solana/web3.js'

@Route('parse')
export class ParseController extends Controller {
    private readonly connection: Connection
    constructor() {
        super()
        this.connection = new Connection()
    }

    @Get('/tx/{txSignature}')
    public async parseTx(@Path() txSignature: string): Promise<PingResponse> {
        this.setStatus(501)
        return {
            ...getServerResponseCommon(),
            error: new Error('Not Implemented'),
        }
    }

    @SuccessResponse('200')
    @Get('/account/{accountPublicKey}')
    public async parseAccount(
        @Path() accountPublicKey: string
    ): Promise<ParsedAccountResponse> {
        let parsedAccount: DripAccountDecodeResponse
        try {
            const accountInfo = await this.connection.getNonNullableAccountInfo(
                accountPublicKey,
                programId ? new PublicKey(programId) : undefined
            )
            parsedAccount = tryDecodeToParsedDripAccount(accountInfo.data)
        } catch (err) {
            if (err instanceof InvalidOwnerError) {
                this.setStatus(400)
            } else if (err instanceof InvalidAccountError) {
                this.setStatus(422)
            } else {
                this.setStatus(500)
            }
            return {
                ...getServerResponseCommon(),
                error:
                    err instanceof Error
                        ? err
                        : new Error('failed to get or parse account info'),
            }
        }
        this.setStatus(200)
        return {
            ...getServerResponseCommon(),
            data: {
                name: parsedAccount.name,
                publicKey: accountPublicKey,
                account: parsedAccount.parsed,
            },
            error: undefined,
        }
    }
}
