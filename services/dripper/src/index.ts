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
import {dripperSeedPhrase, programId} from './env';
import { getPositionHandler } from './dripHandler';
import { IDL } from '@dcaf/drip-types';

async function exitHandler(signal: string, worker: IWorker) {
    await worker.stop();
    console.log(`existing from signal ${signal}`);
    process.exit(0);
}

async function main() {
    if (!programId) {
        throw new Error("empty programId")
    }
    if (!dripperSeedPhrase) {
        throw new Error("empty seed phrase")
    }

    const wallet = new DripperWallet(dripperSeedPhrase);
    const programIdPublicKey = new PublicKey(programId);
    const connection = new Connection();
    const provider = new AnchorProvider(
        connection,
        wallet,
        DEFAULT_CONFIRM_OPTIONS
    );
    const program = new Program(IDL, programIdPublicKey, provider);
    const positionFetcher = new OnChainPositionsFetcher(
        programIdPublicKey,
        connection,
        getPositionHandler(provider, program)
    );
    const worker = new DripWorker(connection, provider, positionFetcher);

    process.on('SIGINT', async () => {
        await exitHandler('SIGINT', worker);
    });
    process.on('SIGTERM', async () => {
        await exitHandler('SIGTERM', worker);
    });
    return worker.start();
}

main().catch((e: unknown) => {
    // TODO(mocha): better logger
    console.error(e);
    throw e;
});
