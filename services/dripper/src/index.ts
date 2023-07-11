import dotenv from 'dotenv';
dotenv.config();

import { DripWorker } from './workers/dripWorker';
import { IWorker } from './workers';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection } from './solana';
import { DripperWallet } from './wallet/dripperWallet';
import { DEFAULT_CONFIRM_OPTIONS } from './utils';
import { OnChainPositionsFetcher } from './positions/onchain';
import { PublicKey } from '@solana/web3.js';
import { dripperSeedPhrase, programId } from './env';
import { getPositionHandler } from './dripHandler';
import { IDL } from '@dcaf/drip-types';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

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
    if (!programId) {
        throw new Error('empty programId');
    }
    if (!dripperSeedPhrase) {
        throw new Error('empty seed phrase');
    }

    const dripperWallet = new DripperWallet(dripperSeedPhrase);
    const programIdPublicKey = new PublicKey(programId);
    const connection = new Connection();
    const provider = new AnchorProvider(
        connection,
        dripperWallet,
        DEFAULT_CONFIRM_OPTIONS
    );
    const program = new Program(IDL, programIdPublicKey, provider);
    logger = logger.data({
        dripperWalletPublicKey: dripperWallet.publicKey.toString(),
        programId: programIdPublicKey.toString(),
    });

    const positionFetcher = new OnChainPositionsFetcher(
        programIdPublicKey,
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
