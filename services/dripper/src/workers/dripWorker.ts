import { IWorker } from './index';
import { Connection } from '@solana/web3.js';
import { IPositionsFetcher } from '../positions';
import { AnchorProvider } from '@coral-xyz/anchor';
import { delay } from '../utils';

export class DripWorker implements IWorker {
    private enabled: boolean;
    private workerPromise: Promise<void>;

    constructor(
        private readonly connection: Connection,
        private readonly provider: AnchorProvider,
        private readonly positions: IPositionsFetcher
    ) {
        this.enabled = false;
        this.workerPromise = Promise.resolve();
    }

    async start(): Promise<void> {
        this.enabled = true;
        this.workerPromise = this.run();
        return this.workerPromise;
    }

    async stop(): Promise<void> {
        this.enabled = false;
        try {
            await Promise.race([
                this.workerPromise,
                new Promise((_r, rej) => setTimeout(rej, 600)),
            ]);
        } catch (e) {
            // TODO: better logs
            console.error(e);
        }
    }

    private async run(): Promise<void> {
        while (this.enabled) {
            const positions = await this.positions.getPositionsPendingDrip();
            console.log(`dripping ${positions.length} positions`);
            const dripTxSigs: string[] = [];
            for (const position of positions) {
                try {
                    dripTxSigs.push(await position.drip());
                } catch (e) {
                    console.log(
                        `failed to drip position ${position
                            .getData()
                            .publicKey.toString()}`
                    );
                    console.error(e);
                }
            }
            // const dripTxSigs = await Promise.all(
            //     positions.map((position) => position.drip())
            // );
            // TODO(mocha): send to api server to queue for fetcher
            console.log(dripTxSigs);
            await delay(100);
        }
    }
}
