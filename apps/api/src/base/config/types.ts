import { Keypair, PublicKey } from '@solana/web3.js';

export enum Environment {
    production = 'production',
    staging = 'staging',
    local = 'local',
}
export const Environments: Environment[] = Object.values(Environment);

// TODO: we can split this into multiple smaller configs
export interface IConfig {
    programId: PublicKey;
    databaseUrl: string;
    environment: string;
    rpcUrl: string;
    rpcWebhookUrl: string;
    tokenMintAuthority: Keypair | undefined;
}
