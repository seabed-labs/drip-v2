import { Controller, Get, Path, Query, Route, SuccessResponse } from 'tsoa'
import { getServerResponseCommon } from './common'
import {
    ParsedAccountResponse,
    Commitment,
    ParsedTxResponse,
    ParsedDripIx,
} from '../service/types'
import { Connection } from '../service/solana'
import {
    DripAccountDecodeResponse,
    tryDecodeToParsedDripAccount,
} from '../service/accountParser'
import { programId } from '../service/programId'
import { PublicKey } from '@solana/web3.js'
import { DefinedRestError } from 'restify-errors'
import { tryDecodeIx } from '../service/ixParser'

@Route('fetch')
export class FetchController extends Controller {
    private readonly connection: Connection

    constructor() {
        super()
        this.connection = new Connection()
    }

    @SuccessResponse('200')
    @Get('/tx/{signature}')
    public async parseTx(
        @Path() signature: string,
        @Query() commitment: Commitment = 'finalized'
    ): Promise<ParsedTxResponse> {
        const instructions: {
            index: number
            instruction?: ParsedDripIx
        }[] = []
        try {
            const tx = await this.connection.getNonNullableTransaction(
                signature,
                commitment
            )
            const accountKeys = tx.transaction.message.getAccountKeys()
            tx.transaction.message.compiledInstructions.forEach((ix, i) => {
                const parsedIx = tryDecodeIx(tx, accountKeys, ix) ?? {}
                instructions.push({
                    index: i,
                    ...parsedIx,
                })
            })
        } catch (err) {
            if (err instanceof DefinedRestError) {
                this.setStatus(err.statusCode)
            } else {
                this.setStatus(500)
            }
            return {
                ...getServerResponseCommon(),
                error:
                    err instanceof Error
                        ? err
                        : new Error('failed to get or parse tx'),
            }
        }

        this.setStatus(200)
        return {
            ...getServerResponseCommon(),
            data: {
                signature,
                instructions,
            },
        }
    }

    @SuccessResponse('200')
    @Get('/account/{accountPublicKey}')
    public async parseAccount(
        @Path() accountPublicKey: string,
        @Query() commitment: Commitment = 'finalized'
    ): Promise<ParsedAccountResponse> {
        let parsedAccount: DripAccountDecodeResponse
        try {
            const accountInfo = await this.connection.getNonNullableAccountInfo(
                accountPublicKey,
                commitment,
                programId ? new PublicKey(programId) : undefined
            )
            parsedAccount = tryDecodeToParsedDripAccount(accountInfo.data)
        } catch (err) {
            if (err instanceof DefinedRestError) {
                this.setStatus(err.statusCode)
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
