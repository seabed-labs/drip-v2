import { DripWorker } from './workers/dripWorker'
import { IWorker } from './workers'
import { AnchorProvider } from '@coral-xyz/anchor'
import { Connection } from './solana'
import { Wallet } from './wallet'
import { DEFAULT_CONFIRM_OPTIONS } from './utils'
import { OnChainPositionsFetcher } from './positions/onchain'

async function exitHandler(signal: string, worker: IWorker) {
    await worker.stop()
    console.log(`existing from signal ${signal}`)
    process.exit(0)
}

async function main() {
    const connection = new Connection()
    const wallet = new Wallet()
    const provider = new AnchorProvider(
        connection,
        wallet,
        DEFAULT_CONFIRM_OPTIONS
    )
    const positionFetcher = new OnChainPositionsFetcher()
    const worker = new DripWorker(connection, provider, positionFetcher)

    process.on('SIGINT', async () => {
        await exitHandler('SIGINT', worker)
    })
    process.on('SIGTERM', async () => {
        await exitHandler('SIGINT', worker)
    })
    return worker.start()
}

main().catch((e: unknown) => {
    // TODO(mocha): better logger
    console.error(e)
    throw e
})
