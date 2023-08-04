import { PublicKey } from '@solana/web3.js';
import { inject } from 'inversify';
import { Controller, Get, Path, Route } from 'tsoa';

import { IAccountRepository } from '../base/repository';
import { ITokenListClient } from '../base/tokenList';
import { TYPES, provideSingleton } from '../ioCTypes';

import { GetTokenListResponse } from './types';

@Route('tokens')
@provideSingleton(TokenController)
export class TokenController extends Controller {
    constructor(
        @inject(TYPES.ITokenListClient)
        private readonly tokenListClient: ITokenListClient
    ) {
        super();
    }

    @Get(`/`)
    public async getTokens(): Promise<GetTokenListResponse> {
        return {
            data: await this.tokenListClient.getTokenList(),
        };
    }
}
