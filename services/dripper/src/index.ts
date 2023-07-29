// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line import/order
import { AnchorProvider } from '@coral-xyz/anchor';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

import { Config } from './config';
import { OnChainPositionsFetcher } from './positions/onChainImpl';
import { Connection } from './solana';
import { JupiterSwap } from './swapHandler/jupiterImpl';
import { MetaAggregator } from './swapHandler/metaAggregatorImpl';
import { PrismSwap } from './swapHandler/prismImpl';
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
    const dripperWallet = new DripperWallet(cfg.dripperSeedPhrase);
    const connection = new Connection(cfg.rpcUrl);
    const provider = new AnchorProvider(
        connection,
        dripperWallet,
        DEFAULT_CONFIRM_OPTIONS
    );
    logger = logger.data({
        dripperWalletPublicKey: dripperWallet.publicKey.toString(),
        programId: cfg.programId.toString(),
    });

    const jupiterSwap = new JupiterSwap(
        logger,
        cfg.solanaCluster,
        connection,
        provider.publicKey
    );
    const prismSwap = new PrismSwap(logger, connection, provider.publicKey);
    const metaSwap = new MetaAggregator(logger, [prismSwap, jupiterSwap]);
    const positionFetcher = new OnChainPositionsFetcher(
        logger,
        cfg.programId,
        connection,
        () => metaSwap
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
