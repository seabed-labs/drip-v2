import { TOKEN_PROGRAM_ID, getMint } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { inject } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { IConnection } from '../rpcConnection';

import { ITokenListClient, TokenMintMetadata } from './types';

export class TokenList implements ITokenListClient {
    private readonly tokenMintAuthority: PublicKey | undefined;

    constructor(
        @inject(TYPES.IConfig) config: IConfig,
        @inject(TYPES.IConnection) private readonly connection: IConnection
    ) {
        this.tokenMintAuthority = config.tokenMintAuthority?.publicKey;
    }

    async getTokenList(): Promise<TokenMintMetadata[]> {
        const localTokens = await this.getTestTokens();

        const jupiterTokens = await (
            await fetch('https://token.jup.ag/strict', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();
        return [...localTokens, ...jupiterTokens];
    }

    async getTestTokens(): Promise<TokenMintMetadata[]> {
        if (!this.tokenMintAuthority) {
            return [];
        }
        const mintMetadata: TokenMintMetadata[] = [];
        const mints = await this.connection.getProgramAccounts(
            TOKEN_PROGRAM_ID,
            {
                dataSlice: {
                    offset: 0,
                    length: 0,
                },
                filters: [
                    {
                        memcmp: {
                            offset: 4, // skip mintAuthorityOption u32
                            bytes: this.tokenMintAuthority.toBase58(), // mintAuthority
                        },
                    },
                ],
            }
        );
        for (let i = 0; i < mints.length; i++) {
            const mint = await getMint(this.connection, mints[i].pubkey);
            mintMetadata.push({
                address: mint.address.toString(),
                chainId: 0,
                decimals: mint.decimals,
                name: mint.address.toString().substring(0, 5),
                symbol: mint.address.toString().substring(0, 5),
                logoURI:
                    'https://static-00.iconduck.com/assets.00/generic-cryptocurrency-icon-512x512-rl54g8zo.png',
                tags: [],
            });
        }
        return mintMetadata;
    }
}
