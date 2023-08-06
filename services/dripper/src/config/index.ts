import { Cluster, PublicKey } from '@solana/web3.js';

export interface IConfig {
    programId: PublicKey;
    dripperSeedPhrase: string;
    solanaCluster: Cluster;
    rpcUrl: string;
}

export * from './impl';
