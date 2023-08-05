import { Keypair, PublicKey } from '@solana/web3.js';
import { injectable } from 'inversify';

import { Environment, Environments, IConfig } from './types';

@injectable()
export class Config implements IConfig {
    private readonly _programId: PublicKey;
    private readonly _databaseUrl: string;
    private readonly _rpcUrl: string;
    private readonly _rpcWebhookUrl: string;
    private readonly _environment: Environment;
    private readonly _tokenMintAuthority: Keypair | undefined;

    constructor() {
        const programId = process.env.DRIP_PROGRAM_ID;
        if (!programId) {
            throw new Error(`DRIP_PROGRAM_ID is not set`);
        }
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error(`DATABASE_URL is not set`);
        }
        const rpcUrl = process.env.RPC_URL;
        if (!rpcUrl) {
            throw new Error(`RPC_URL is not set`);
        }
        const rpcWebhookUrl = process.env.RPC_URL;
        if (!rpcWebhookUrl) {
            throw new Error(`RPC_WEBHOOK_URL is not set`);
        }
        const environment = process.env.ENVIRONMENT;
        if (!environment) {
            throw new Error(`SOLANA_CLUSTER is not set`);
        }
        if (!Environments.includes(environment as Environment)) {
            throw new Error(
                `Invalid environment. Got ${environment}, expected one of ${JSON.stringify(
                    Environments
                )}`
            );
        }
        this._environment = environment as Environment;
        this._programId = new PublicKey(programId);
        this._databaseUrl = databaseUrl;
        this._rpcUrl = rpcUrl;
        this._rpcWebhookUrl = rpcWebhookUrl;

        if (
            this._environment !== Environment.production &&
            process.env.TOKEN_MINT_AUTHORITY
        ) {
            const keypairData = JSON.parse(process.env.TOKEN_MINT_AUTHORITY);
            const secretKey = Uint8Array.from(keypairData);
            this._tokenMintAuthority = Keypair.fromSecretKey(secretKey);
        }
    }

    get tokenMintAuthority(): Keypair | undefined {
        return this._tokenMintAuthority;
    }

    get programId(): PublicKey {
        return this._programId;
    }

    get databaseUrl(): string {
        return this._databaseUrl;
    }

    get environment(): string {
        return this._environment;
    }

    get rpcUrl(): string {
        return this._rpcUrl;
    }

    get rpcWebhookUrl(): string {
        return this._rpcWebhookUrl;
    }
}
