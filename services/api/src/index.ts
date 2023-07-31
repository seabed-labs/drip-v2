// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { app } from './app';
import { logger } from './base/logger';

const port = process.env.PORT || 3000;

app.listen(port, () =>
    logger.info(`Example app listening at http://localhost:${port}`, { port })
);
