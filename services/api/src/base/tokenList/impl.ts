import { ITokenListClient, TokenMintMetadata } from './types';

export class JupiterTokenList implements ITokenListClient {
    async getTokenList(): Promise<TokenMintMetadata[]> {
        return (
            await fetch('https://token.jup.ag/strict', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        ).json();
    }
}
