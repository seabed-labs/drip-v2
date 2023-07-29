// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { IDL } from '@dcaf/drip-types';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { Config } from './config';
import { getPositionHandler } from './dripHandler';
import { OnChainPositionsFetcher } from './positions/onChainImpl';
import { Connection } from './solana';
import { DEFAULT_CONFIRM_OPTIONS } from './utils';
import { DripperWallet } from './wallet/impl';
import { IWorker } from './workers';
import { DripWorker } from './workers/impl';

const { combine, timestamp, label } = format;

let logger = winston.createLogger({
    level: 'verbose',
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({ filename: 'dripper.log' }),
    ],
    format: combine(label({ label: 'dripper' }), timestamp()),
});

async function exitHandler(signal: string, worker: IWorker) {
    await worker.stop();
    logger.data({ signal }).info('exiting dripper');
    process.exit(0);
}

async function main() {
    const cfg = new Config();
    const dripperWallet = new DripperWallet(cfg.dripperSeedPhrase());
    const connection = new Connection(cfg.rpcUrl());
    const provider = new AnchorProvider(
        connection,
        dripperWallet,
        DEFAULT_CONFIRM_OPTIONS
    );
    const program = new Program(IDL, cfg.programId(), provider);
    logger = logger.data({
        dripperWalletPublicKey: dripperWallet.publicKey.toString(),
        programId: cfg.programId().toString(),
    });
    const positionFetcher = new OnChainPositionsFetcher(
        cfg.programId(),
        connection,
        getPositionHandler(logger, dripperWallet, provider, program)
    );
    const worker = new DripWorker(
        logger,
        connection,
        provider,
        positionFetcher
    );

    process.on('SIGINT', async () => {
        await exitHandler('SIGINT', worker);
    });
    process.on('SIGTERM', async () => {
        await exitHandler('SIGTERM', worker);
    });
    return worker.start();
}

main().catch((e: unknown) => {
    logger
        .data({ error: JSON.stringify(e) })
        .error('uncaught exception in dripper worker loop');
    console.error(e);
    throw e;
});
