import { Cluster, PublicKey } from '@solana/web3.js';

import { IConfig } from '.';

export class Config implements IConfig {
    private readonly _programId: PublicKey;
    private readonly _dripperSeedPhrase: string;
    private readonly _solanaCluster: Cluster;
    private readonly _rpcUrl: string;

    constructor() {
        const programId = process.env.DRIP_PROGRAM_ID;
        if (!programId) {
            throw new Error(`DRIP_PROGRAM_ID is not set`);
        }
        const dripperSeedPhrase = process.env.DRIPPER_ROOT_SEED_PHRASE;
        if (!dripperSeedPhrase) {
            throw new Error(`DRIPPER_ROOT_SEED_PHRASE is not set`);
        }
        const cluster = process.env.SOLANA_CLUSTER;
        if (!cluster) {
            throw new Error(`SOLANA_CLUSTER is not set`);
        }
        if (['devnet', 'testnet', 'mainnet-beta'].includes(cluster)) {
            throw new Error(`Invalid cluster ${cluster}`);
        }
        const rpcUrl = process.env.DRIPPER_RPC_URL;
        if (!rpcUrl) {
            throw new Error(`DRIPPER_RPC_URL is not set`);
        }

        this._programId = new PublicKey(programId);
        this._dripperSeedPhrase = dripperSeedPhrase;
        this._solanaCluster = cluster as Cluster;
        this._rpcUrl = rpcUrl;
    }

    get programId(): PublicKey {
        return this._programId;
    }
    get dripperSeedPhrase(): string {
        return this._dripperSeedPhrase;
    }
    get solanaCluster(): Cluster {
        return this._solanaCluster;
    }
    get rpcUrl(): string {
        return this._rpcUrl;
    }
}
