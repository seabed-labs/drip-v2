import { inject, injectable } from 'inversify';
import { Logger as WinstonLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { TYPES } from '../../ioCTypes';
import { Environment, IConfig } from '../config';

import { ILogger } from './types';

const { combine, timestamp, label } = format;

@injectable()
export class Logger extends WinstonLogger implements ILogger {
    constructor(@inject(TYPES.IConfig) private readonly config: IConfig) {
        super({
            level: 'debug',
            defaultMeta: 'drip-api',
            transports: [new transports.Console()],
            format: combine(label({ label: 'dripper' }), timestamp()),
        });
        if (this.config.environment === Environment.production) {
            this.level = 'info';
            this.add(new DailyRotateFile({ filename: 'dripper.log' }));
        }
    }
}
