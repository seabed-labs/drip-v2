import { PublicKey } from '@solana/web3.js';
import { inject, optional } from 'inversify';
import { Body, Controller, Get, Path, Post, Route } from 'tsoa';

import { IConfig } from '../base/config';
import { logger } from '../base/logger';
import { ITokenListClient } from '../base/tokenList';
import { ITokenMinter } from '../base/tokenMinter';
import { TYPES, provideSingleton } from '../ioCTypes';

import {
    GetTokenListResponse,
    GetTokenResponse,
    MintTestToken,
    MintTestTokenBody,
} from './types';

@Route('tokens')
@provideSingleton(TokenController)
export class TokenController extends Controller {
    constructor(
        @inject(TYPES.IConfig)
        private readonly config: IConfig,
        @inject(TYPES.ITokenListClient)
        private readonly tokenListClient: ITokenListClient,
        @inject(TYPES.ITokenMinter)
        @optional()
        private readonly tokenMinter?: ITokenMinter
    ) {
        super();
    }

    // TODO: Cache this
    @Get(`/`)
    public async getTokens(): Promise<GetTokenListResponse> {
        return {
            data: await this.tokenListClient.getTokenList(),
        };
    }

    // TODO: Cache this
    @Get(`/{tokenMint}`)
    public async getToken(
        @Path('tokenMint') tokenMint: string
    ): Promise<GetTokenResponse> {
        try {
            new PublicKey(tokenMint);
        } catch (e) {
            logger.warn('invalid public key', { e });
            this.setStatus(400);
            return {
                error: 'Invalid public key',
            };
        }
        const getTokensResponse = await this.getTokens();
        if (!('data' in getTokensResponse)) {
            return getTokensResponse;
        }
        const token = getTokensResponse.data.find(
            (token) => token.address === tokenMint
        );
        if (token) {
            return {
                data: token,
            };
        } else {
            this.setStatus(404);
            return {
                error: 'Token not found',
            };
        }
    }

    @Post(`/{tokenMint}/mint`)
    public async mintTo(
        @Path('tokenMint') tokenMintStr: string,
        @Body() mintRequest: MintTestTokenBody
    ): Promise<MintTestToken> {
        if (!this.tokenMinter) {
            this.setStatus(422);
            return {
                error: 'Token Minter not available',
            };
        }
        let tokenMint: PublicKey;
        let to: PublicKey;
        let amount: bigint;
        try {
            tokenMint = new PublicKey(tokenMintStr);
            to = new PublicKey(mintRequest.to);
            amount = BigInt(mintRequest.amount);
        } catch (e) {
            logger.error('invalid public key', { e });
            this.setStatus(400);
            return {
                error: 'Invalid public key',
            };
        }

        return {
            data: await this.tokenMinter.mintTo(tokenMint, to, amount),
        };
    }
}
