import { translateAddress } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import {
    Response,
    Controller,
    Get,
    Path,
    Query,
    Route,
    SuccessResponse,
} from 'tsoa';

import { tryDecodeToParsedDripAccount } from '../service/accountParser';
import { programId } from '../service/env';
import { tryDecodeIx } from '../service/ixParser';
import { Connection } from '../service/solana';
import {
    ParsedAccountResponse,
    Commitment,
    ParsedTxResponse,
    RestError,
    ParsedDripIxWithIndex,
} from '../service/types';

@Route('fetch')
export class FetchController extends Controller {
    private readonly connection: Connection;

    constructor() {
        super();
        this.connection = new Connection();
    }

    @Response<RestError>(400)
    @Response<RestError>(404)
    @Response<RestError>(422)
    @Response<RestError>(500)
    @SuccessResponse(200)
    @Get('/tx/{signature}')
    public async parseTx(
        @Path() signature: string,
        @Query() commitment: Commitment = 'finalized'
    ): Promise<ParsedTxResponse> {
        const instructions: ParsedDripIxWithIndex[] = [];
        const tx = await this.connection.getNonNullableTransaction(
            signature,
            commitment
        );
        const accountKeys = tx.transaction.message.getAccountKeys();
        tx.transaction.message.compiledInstructions.forEach((ix, i) => {
            const parsedIx = tryDecodeIx(tx, accountKeys, ix) ?? {};
            instructions.push({
                index: i,
                ...parsedIx,
            });
        });
        return {
            signature,
            instructions,
        };
    }

    @Response<RestError>(400)
    @Response<RestError>(404)
    @Response<RestError>(500)
    @SuccessResponse(200)
    @Get('/account/{accountPublicKey}')
    public async parseAccount(
        @Path('accountPublicKey') accountPublicKeyStr: string,
        @Query() commitment: Commitment = 'finalized'
    ): Promise<ParsedAccountResponse> {
        let accountPublicKey: PublicKey;
        try {
            accountPublicKey = translateAddress(accountPublicKeyStr);
        } catch (e) {
            throw RestError.invalid(
                `public key ${accountPublicKeyStr} is not valid`
            );
        }
        const accountInfo = await this.connection.getNonNullableAccountInfo(
            accountPublicKey,
            commitment,
            programId
        );
        const parsedAccount = tryDecodeToParsedDripAccount(accountInfo.data);
        this.setStatus(200);
        return {
            publicKey: accountPublicKey.toString(),
            ...parsedAccount,
        };
    }
}
