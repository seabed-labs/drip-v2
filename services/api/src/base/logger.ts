import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

export const logger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({ filename: 'drip-api.log' }),
    ],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.label({ label: 'dripper' }),
        // winston.format.label({ label: 'dripper' }),
        // winston.format.timestamp(),
        winston.format.colorize()
    ),
});
