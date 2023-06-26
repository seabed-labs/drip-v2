import { IWorker } from './index'
import { Connection } from '@solana/web3.js'
import { IPositionsFetcher } from '../positions'
import Provider from '@coral-xyz/anchor/dist/cjs/provider'
export class DripWorker implements IWorker {
    private enabled: boolean
    private workerPromise: Promise<void>

    constructor(
        private readonly connection: Connection,
        private readonly provider: Provider,
        private readonly positions: IPositionsFetcher
    ) {
        this.enabled = false
        this.workerPromise = Promise.resolve()
    }

    async start(): Promise<void> {
        this.enabled = true
        this.workerPromise = this.run()
        return this.workerPromise
    }

    async stop(): Promise<void> {
        this.enabled = false
        try {
            await Promise.race([
                this.workerPromise,
                new Promise((_r, rej) => setTimeout(rej, 600)),
            ])
        } catch (e) {
            // TODO: better logs
            console.error(e)
        }
    }

    private async run(): Promise<void> {
        while (this.enabled) {
            const positions = await this.positions.find()
            const dripTxSigs = await Promise.all(
                positions.map((position) =>
                    this.positions
                        .getDripHandler(position)
                        .dripPosition(this.provider, position)
                )
            )
            // TODO(mocha): send to api server to queue for fetcher
            console.log(dripTxSigs)
        }
    }
}