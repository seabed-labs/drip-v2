import { inject, injectable } from 'inversify';

import { PrismaClient } from '../../generated/prismaClient';
import { PrismaClientOptions } from '../../generated/prismaClient/runtime/library';
import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { logger } from '../logger';

import { IDatabase } from './types';

@injectable()
export class Database
    extends PrismaClient<PrismaClientOptions, 'error'>
    implements IDatabase
{
    constructor(@inject(TYPES.IConfig) config: IConfig) {
        super({
            datasources: {
                db: {
                    url: config.databaseUrl,
                },
            },
            log: [
                {
                    emit: 'event',
                    level: 'error',
                },
            ],
        });

        this.$on('error', (e) => {
            logger.error('database error', e);
        });
    }
}
