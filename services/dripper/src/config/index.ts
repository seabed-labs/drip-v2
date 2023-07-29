import { Cluster, PublicKey } from '@solana/web3.js';

export interface IConfig {
    get programId(): PublicKey;
    get dripperSeedPhrase(): string;
    get solanaCluster(): Cluster;
    get rpcUrl(): string;
}

export * from './impl';
