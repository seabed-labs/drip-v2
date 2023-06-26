import { Accounts } from '@dcaf/drip-types'
import {
    AddressLookupTableAccount,
    AddressLookupTableProgram,
    Connection,
    PublicKey,
    TransactionInstruction,
    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js'
import { DEFAULT_CONFIRM_OPTIONS, paginate } from '../utils'
import Provider from '@coral-xyz/anchor/dist/cjs/provider'
import assert from 'assert'
import { AnchorProvider } from '@coral-xyz/anchor'

const MAX_ACCOUNTS_PER_TX = 20
const ACCOUNTS_PER_LUT = 256

export abstract class DripHandlerBase {
    constructor(
        private readonly provider: AnchorProvider,
        private readonly connection: Connection
    ) {}

    async createDripInstructions(
        position: Accounts.DripPosition
    ): Promise<TransactionInstruction[]> {
        throw new Error('not implemented')
    }

    async getPairConfig(
        position: Accounts.DripPosition
    ): Promise<Accounts.PairConfig> {
        throw new Error('not implemented')
    }

    async shouldInitPairConfig(
        position: Accounts.DripPosition
    ): Promise<boolean> {
        const pairConfig = await this.getPairConfig(position)
        return (
            pairConfig.inputTokenPriceOracle.kind === 'Unavailable' ||
            pairConfig.outputTokenPriceOracle.kind === 'Unavailable'
        )
    }

    async getInitPairConfigIx(
        position: Accounts.DripPosition
    ): Promise<TransactionInstruction[]> {
        throw new Error('not implemented')
    }

    async dripPosition(
        provider: Provider,
        position: Accounts.DripPosition
    ): Promise<string> {
        const dripIxs = await this.createDripInstructions(position)
        const luts = await this.createLookupTables(dripIxs)
        const dripTxs = await this.createVersionedTransactions([dripIxs], luts)
        assert(dripTxs.length === 1, new Error('TODO'))
        const txSig = await this.provider.sendAndConfirm(
            dripTxs[0],
            [],
            DEFAULT_CONFIRM_OPTIONS
        )
        await this.closeLookupTables(luts)
        return txSig
    }

    async createLookupTables(
        dripIxs: TransactionInstruction[]
    ): Promise<AddressLookupTableAccount[]> {
        // TODO(mocha): is there an easier/cleaner way to dedupe?
        const accounts = [
            ...new Set(
                dripIxs.flatMap((ix) => {
                    return ix.keys.map((ixKey) => ixKey.pubkey.toString())
                })
            ),
        ].map((accountString) => new PublicKey(accountString))

        const slot = await this.connection.getSlot()
        // each row represents the instructions for a tx
        const ixsForTxs: TransactionInstruction[][] = []
        const lutAddresses: PublicKey[] = []

        // paginate to create each lut
        await paginate(
            accounts,
            async (lutAccounts) => {
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

        const txs = await this.createVersionedTransactions(ixsForTxs)
        await this.provider.sendAll(
            txs.map(
                (tx) => {
                    return {
                        tx,
                    }
                },
                {
                    ...DEFAULT_CONFIRM_OPTIONS,
                    minContextSlot: slot,
                }
            )
        )
        const luts = await Promise.all(
            lutAddresses.map((lutAddress) => {
                return this.connection.getAddressLookupTable(lutAddress)
            })
        )
        return luts.map((lut) => {
            assert(lut.value, new Error('TODO'))
            return lut.value
        })
    }

    async closeLookupTables(luts: AddressLookupTableAccount[]): Promise<void> {
        const closeLutIxs = luts.map((lut) => {
            return AddressLookupTableProgram.closeLookupTable({
                lookupTable: lut.key,
                authority: this.provider.publicKey,
                recipient: this.provider.publicKey,
            })
        })
        const tx = (
            await this.createVersionedTransactions([closeLutIxs], luts)
        )[0]
        assert(tx, new Error('TODO'))
        await this.provider.sendAndConfirm(tx, [], DEFAULT_CONFIRM_OPTIONS)
    }

    private async createVersionedTransactions(
        instructionsForTxs: TransactionInstruction[][],
        addressLookupTableAccounts?: AddressLookupTableAccount[]
    ): Promise<VersionedTransaction[]> {
        const recentBlockhash = (await this.connection.getLatestBlockhash())
            .blockhash
        return instructionsForTxs.map((instructions) => {
            const messageV0 = new TransactionMessage({
                payerKey: this.provider.publicKey,
                recentBlockhash,
                instructions,
            }).compileToV0Message(addressLookupTableAccounts)
            return new VersionedTransaction(messageV0)
        })
    }
}
