import { Connection as Web3Connection } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';

import { IConnection } from './types';

@injectable()
export class Connection extends Web3Connection implements IConnection {
    constructor(@inject(TYPES.IConfig) config: IConfig) {
        super(config.rpcUrl, {
            commitment: 'confirmed',
            wsEndpoint: config.rpcWebhookUrl,
        });
    }
}
