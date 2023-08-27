export interface TokenMintMetadata {
    address: string;
    chainId: number;
    decimals: number;
    name: string;
    symbol: string;
    logoURI: string;
    tags: string[];
    extensions?: Extensions;
}

export interface Extensions {
    coingeckoId: string;
}

export interface ITokenListClient {
    getTokenList(): Promise<TokenMintMetadata[]>;
}
