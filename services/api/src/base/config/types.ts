import { Keypair, PublicKey } from '@solana/web3.js';

export enum Environment {
    production = 'production',
    staging = 'staging',
    local = 'local',
}
export const Environments: Environment[] = Object.values(Environment);

// TODO: we can split this into multiple smaller configs
export interface IConfig {
    get programId(): PublicKey;
    get databaseUrl(): string;
    get environment(): string;
    get rpcUrl(): string;
    get rpcWebhookUrl(): string;
    get tokenMintAuthority(): Keypair | undefined;
}
