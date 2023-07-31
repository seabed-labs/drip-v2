import { inject, injectable } from 'inversify';
import { Pool } from 'pg';

import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { ILogger } from '../logger';

import { IDatabasePool } from './types';

@injectable()
export class DatabasePool extends Pool implements IDatabasePool {
    constructor(
        @inject(TYPES.IConfig) config: IConfig,
        @inject(TYPES.ILogger) logger: ILogger
    ) {
        super({
            connectionString: config.databaseUrl,
        });
        this.on('error', (err) => logger.data(err).error('postgress error'));
    }
}
