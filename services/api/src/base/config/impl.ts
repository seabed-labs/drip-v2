import { PublicKey } from '@solana/web3.js';
import { injectable } from 'inversify';

import { Environment, Environments, IConfig } from './types';

@injectable()
export class Config implements IConfig {
    private readonly _programId: PublicKey;
    private readonly _databaseUrl: string;
    private readonly _rpcUrl: string;
    private readonly _rpcWebhookUrl: string;
    private readonly _environment: Environment;

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
        this._programId = new PublicKey(programId);
        this._databaseUrl = databaseUrl;
        this._environment = environment as Environment;
        this._rpcUrl = rpcUrl;
        this._rpcWebhookUrl = rpcWebhookUrl;
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
