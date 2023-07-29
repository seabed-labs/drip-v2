import { AnchorProvider } from '@coral-xyz/anchor';
import { Connection } from '@solana/web3.js';
import { Logger } from 'winston';

import { IPositionsFetcher } from '../positions';
import { delay, tryWithReturn } from '../utils';

import { IWorker } from './index';

export class DripWorker implements IWorker {
    private enabled: boolean;
    private workerPromise: Promise<void>;

    constructor(
        private readonly logger: Logger,
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
            this.logger
                .data({ error: JSON.stringify(e) })
                .error('failed to stop dripper');
        }
    }

    private async run(): Promise<void> {
        while (this.enabled) {
            const positions = await this.positions.getPositionsPendingDrip();
            this.logger
                .data({ numPositions: positions.length })
                .info(`dripping positions`);
            const dripTxSigs: (string | undefined)[] = [];
            for (const position of positions) {
                dripTxSigs.push(
                    await tryWithReturn(this.logger, position.drip, (e) => {
                        this.logger
                            .data({
                                error: JSON.stringify(e),
                                dripPositionPublicKey: position
                                    .getData()
                                    .address.toString(),
                            })
                            .error('failed to drip');
                        return undefined;
                    })
                );
            }
            // TODO(#116): send to api server to queue for fetcher
            this.logger.data({ dripTxSigs }).info('dripped positions');
            await delay(100);
        }
    }
}
