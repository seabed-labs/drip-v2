import { Accounts } from '@dcaf/drip-types'
import {
    AddressLookupTableAccount,
    AddressLookupTableProgram,
    Connection,
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js'
import {
    dedupeInstructionsPublicKeys,
    DEFAULT_CONFIRM_OPTIONS,
    paginate,
} from '../utils'
import assert from 'assert'
import { AnchorProvider } from '@coral-xyz/anchor'
import { createVersionedTransactions } from '../solana'
import { DripInstructions } from './index'

const MAX_ACCOUNTS_PER_TX = 20
const ACCOUNTS_PER_LUT = 256

export abstract class PositionHandlerBase {
    protected constructor(
        readonly provider: AnchorProvider,
        readonly connection: Connection,
        readonly dripPosition: Accounts.DripPosition
    ) {}

    async createSwapInstructions(): Promise<DripInstructions> {
        throw new Error('not implemented')
    }

    async getPairConfig(): Promise<Accounts.PairConfig> {
        throw new Error('not implemented')
    }

    shouldSetOracle(pairConfig: Accounts.PairConfig): boolean {
        return (
            pairConfig.inputTokenPriceOracle.kind === 'Unavailable' ||
            pairConfig.outputTokenPriceOracle.kind === 'Unavailable'
        )
    }

    async createUpdatePairConfigOracleIx(
        pairConfig: Accounts.PairConfig
    ): Promise<TransactionInstruction> {
        throw new Error('not implemented')
    }

    async drip(): Promise<string> {
        const swapIxs = await this.createSwapInstructions()
        // takes care of things like setting up token accounts
        if (swapIxs.preSwapInstructions.length) {
            const [preSwapSetupTx] = await createVersionedTransactions(
                this.connection,
                this.provider.publicKey,
                [swapIxs.preSwapInstructions]
            )
            const txSig = await this.provider.sendAndConfirm(
                preSwapSetupTx,
                swapIxs.preSigners,
                DEFAULT_CONFIRM_OPTIONS
            )
            console.log(`setup swap in tx ${txSig}`)
        }
        const dripIxsWithSandwich = await this.createDripSandwich(
            swapIxs.swapInstructions
        )
        const { txSigs: createLutsTxSigs, luts } =
            await this.createLookupTables(dripIxsWithSandwich)
        console.log(`created luts in txs ${JSON.stringify(createLutsTxSigs)}`)
        const [dripTx] = await createVersionedTransactions(
            this.connection,
            this.provider.publicKey,
            [dripIxsWithSandwich],
            luts
        )
        assert(dripTx, new Error('TODO'))
        // TODO(Mocha): wrap closure of lut in try/catch, shouldn't block returning txSig for drip
        const txSig = await this.provider.sendAndConfirm(
            dripTx,
            [],
            DEFAULT_CONFIRM_OPTIONS
        )
        const closeLutsTxSig = await this.closeLookupTables(luts)
        console.log(`closed luts in tx ${closeLutsTxSig}`)

        // cleanup ephemeral token accounts
        if (swapIxs.postSwapInstructions.length) {
            const [postSwapCleanupTx] = await createVersionedTransactions(
                this.connection,
                this.provider.publicKey,
                [swapIxs.postSwapInstructions]
            )
            const txSig = await this.provider.sendAndConfirm(
                postSwapCleanupTx,
                [],
                DEFAULT_CONFIRM_OPTIONS
            )
            console.log(`cleaned up drip swap with ${txSig}`)
        }
        return txSig
    }

    private async createDripSandwich(
        swapIxs: TransactionInstruction[]
    ): Promise<TransactionInstruction[]> {
        const ixs: TransactionInstruction[] = []
        const pairConfig = await this.getPairConfig()
        if (this.shouldSetOracle(pairConfig)) {
            ixs.push(await this.createUpdatePairConfigOracleIx(pairConfig))
        }
        // TODO(Mocha): create preDrip Ix
        ixs.push(...swapIxs)
        // TODO(Mocha): create postDrip Ix
        return ixs
    }

    private async createLookupTables(
        dripIxs: TransactionInstruction[]
    ): Promise<{
        txSigs: string[]
        luts: AddressLookupTableAccount[]
    }> {
        const accounts = dedupeInstructionsPublicKeys(dripIxs)

        // each row represents the instructions for a tx
        const ixsForTxs: TransactionInstruction[][] = []
        const lutAddresses: PublicKey[] = []

        // paginate to create each lut
        await paginate(
            accounts,
            async (lutAccounts) => {
                const slot = await this.connection.getSlot()
                const [lookupTableInst, lookupTableAddress] =
                    AddressLookupTableProgram.createLookupTable({
                        authority: this.provider.publicKey,
                        payer: this.provider.publicKey,
                        recentSlot: slot,
                    })
                lutAddresses.push(lookupTableAddress)
                ixsForTxs.push([lookupTableInst])

                // paginate to populate lut
                await paginate(
                    lutAccounts,
                    async (extendLutAccounts) => {
                        const extendInstruction =
                            AddressLookupTableProgram.extendLookupTable({
                                payer: this.provider.publicKey,
                                authority: this.provider.publicKey,
                                lookupTable: lookupTableAddress,
                                addresses: extendLutAccounts,
                            })
                        ixsForTxs.push([extendInstruction])
                    },
                    MAX_ACCOUNTS_PER_TX
                )
            },
            ACCOUNTS_PER_LUT
        )

        const txs = await createVersionedTransactions(
            this.connection,
            this.provider.publicKey,
            ixsForTxs
        )
        const txSigs = await this.provider.sendAll(
            txs.map((tx) => ({ tx }), DEFAULT_CONFIRM_OPTIONS)
        )
        const luts = await Promise.all(
            lutAddresses.map((lutAddress) =>
                this.connection.getAddressLookupTable(lutAddress)
            )
        )
        return {
            txSigs,
            luts: luts.map((lut) => {
                assert(lut.value, new Error('TODO'))
                return lut.value
            }),
        }
    }

    private async closeLookupTables(
        luts: AddressLookupTableAccount[]
    ): Promise<string> {
        const closeLutIxs = luts.map((lut) =>
            AddressLookupTableProgram.closeLookupTable({
                lookupTable: lut.key,
                authority: this.provider.publicKey,
                recipient: this.provider.publicKey,
            })
        )
        const [tx] = await createVersionedTransactions(
            this.connection,
            this.provider.publicKey,
            [closeLutIxs],
            luts
        )
        assert(tx, new Error('TODO'))
        return await this.provider.sendAndConfirm(
            tx,
            [],
            DEFAULT_CONFIRM_OPTIONS
        )
    }
}
