import { Accounts, DripV2 } from '@dcaf/drip-types';
import {
    AddressLookupTableAccount,
    AddressLookupTableProgram,
    PublicKey,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    dedupeInstructionsPublicKeys,
    DEFAULT_CONFIRM_OPTIONS,
    delay,
    paginate,
} from '../utils';
import assert from 'assert';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { createVersionedTransactions } from '../solana';
import { SwapQuoteWithInstructions } from './index';
import {
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token-0-3-8';

const MAX_ACCOUNTS_PER_TX = 20;
const ACCOUNTS_PER_LUT = 256;

export abstract class PositionHandlerBase {
    protected constructor(
        readonly provider: AnchorProvider,
        readonly program: Program<DripV2>,
        readonly dripPosition: Accounts.DripPosition,
        readonly dripPositionPublicKey: PublicKey
    ) {}

    abstract createSwapInstructions(): Promise<SwapQuoteWithInstructions>;

    async getPairConfig(): Promise<Accounts.PairConfig> {
        const pairConfig = await Accounts.PairConfig.fetch(
            this.provider.connection,
            this.dripPosition.pairConfig,
            this.program.programId
        );
        if (!pairConfig) {
            // TODO: define error
            throw new Error('pair config not found');
        }
        return pairConfig;
    }

    shouldSetOracle(pairConfig: Accounts.PairConfig): boolean {
        return (
            pairConfig.inputTokenPriceOracle.kind === 'Unavailable' ||
            pairConfig.outputTokenPriceOracle.kind === 'Unavailable'
        );
    }

    async createUpdatePairConfigOracleIx(
        pairConfig: Accounts.PairConfig
    ): Promise<TransactionInstruction | undefined> {
        // TODO
        return undefined;
    }

    async drip(): Promise<string> {
        // create token accounts and setup oracle if needed
        const setupIxs = await this.dripSetup();
        if (setupIxs.length) {
            const dripSetupTxSig = await this.provider.sendAndConfirm(
                new Transaction().add(...setupIxs),
                [],
                DEFAULT_CONFIRM_OPTIONS
            );
            console.log('dripSetupTxSig', dripSetupTxSig);
        }

        const { inputAmount, minOutputAmount, ...swapIxs } =
            await this.createSwapInstructions();

        // swap tx setup
        if (swapIxs.preSwapInstructions.length) {
            const [preSwapSetupTx] = await createVersionedTransactions(
                this.provider.connection,
                this.provider.publicKey,
                [swapIxs.preSwapInstructions]
            );
            const swagSetupTxSig = await this.provider.sendAndConfirm(
                preSwapSetupTx,
                swapIxs.preSigners,
                DEFAULT_CONFIRM_OPTIONS
            );
            console.log('swagSetupTxSig', swagSetupTxSig);
        }

        const dripIxsWithSandwich = await this.createDripSandwich(
            swapIxs.swapInstructions,
            inputAmount,
            minOutputAmount
        );
        const { txSigs: createLutsTxSigs, luts } =
            await this.createLookupTables(dripIxsWithSandwich);
        console.log(`created luts in txs ${JSON.stringify(createLutsTxSigs)}`);
        const [dripTx] = await createVersionedTransactions(
            this.provider.connection,
            this.provider.publicKey,
            [dripIxsWithSandwich],
            luts
        );
        assert(dripTx, new Error('TODO'));
        // TODO(Mocha): wrap closure of lut in try/catch, shouldn't block returning txSig for drip
        let dripTxSig = '';

        try {
            dripTxSig = await this.provider.sendAndConfirm(dripTx, [], {
                ...DEFAULT_CONFIRM_OPTIONS,
                // TODO: Remove
                // skipPreflight: true,
            });
        } catch (e) {
            console.log(JSON.stringify(e, null, 2));
            throw e;
        }

        console.log('dripTxSig', dripTxSig);

        const closeLutsTxSig = await this.deactivateLookupTables(luts);
        console.log('closeLutsTxSig', closeLutsTxSig);

        // cleanup ephemeral token accounts
        if (swapIxs.postSwapInstructions.length) {
            const [postSwapCleanupTx] = await createVersionedTransactions(
                this.provider.connection,
                this.provider.publicKey,
                [swapIxs.postSwapInstructions]
            );
            const txSig = await this.provider.sendAndConfirm(
                postSwapCleanupTx,
                [],
                DEFAULT_CONFIRM_OPTIONS
            );
            console.log(`cleaned up drip swap with ${txSig}`);
        }
        return dripTxSig;
    }

    private async dripSetup(): Promise<TransactionInstruction[]> {
        const ixs: TransactionInstruction[] = [];
        const pairConfig = await this.getPairConfig();
        if (this.shouldSetOracle(pairConfig)) {
            const ix = await this.createUpdatePairConfigOracleIx(pairConfig);
            if (ix) {
                ixs.push(ix);
            }
        }
        const [globalConfigSigner] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-global-signer'),
                this.dripPosition.globalConfig.toBuffer(),
            ],
            this.program.programId
        );
        const { instruction: initInputTokenFeeAccount } =
            await this.maybeInitAta(
                this.dripPosition.inputTokenMint,
                globalConfigSigner,
                true
            );
        if (initInputTokenFeeAccount) {
            ixs.push(initInputTokenFeeAccount);
        }
        const { instruction: initOutputTokenFeeAccount } =
            await this.maybeInitAta(
                this.dripPosition.outputTokenMint,
                globalConfigSigner,
                true
            );
        if (initOutputTokenFeeAccount) {
            ixs.push(initOutputTokenFeeAccount);
        }
        const { instruction: initDripperInputTokenAccount } =
            await this.maybeInitAta(
                this.dripPosition.inputTokenMint,
                this.provider.publicKey
            );
        if (initDripperInputTokenAccount) {
            ixs.push(initDripperInputTokenAccount);
        }
        const { instruction: initDripperOutputTokenAccount } =
            await this.maybeInitAta(
                this.dripPosition.outputTokenMint,
                this.provider.publicKey
            );
        if (initDripperOutputTokenAccount) {
            ixs.push(initDripperOutputTokenAccount);
        }
        return ixs;
    }

    private async createDripSandwich(
        swapIxs: TransactionInstruction[],
        dripAmountToFill: bigint,
        minimumOutputTokensExpected: bigint
    ): Promise<TransactionInstruction[]> {
        const ixs: TransactionInstruction[] = [];
        const [globalConfigSigner] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-global-signer'),
                this.dripPosition.globalConfig.toBuffer(),
            ],
            this.program.programId
        );
        const { address: inputTokenFeeAccount } = await this.maybeInitAta(
            this.dripPosition.inputTokenMint,
            globalConfigSigner,
            true
        );
        const { address: outputTokenFeeAccount } = await this.maybeInitAta(
            this.dripPosition.outputTokenMint,
            globalConfigSigner,
            true
        );
        const { address: dripperInputTokenAccount } = await this.maybeInitAta(
            this.dripPosition.inputTokenMint,
            this.provider.publicKey
        );
        const [dripPositionSigner] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-drip-position-signer'),
                this.dripPositionPublicKey.toBuffer(),
            ],
            this.program.programId
        );

        const preDripIx = await this.program.methods
            .preDrip({
                dripAmountToFill: new BN(dripAmountToFill.toString()),
                minimumOutputTokensExpected: new BN(
                    minimumOutputTokensExpected.toString()
                ),
            })
            .accounts({
                signer: this.provider.publicKey,
                globalConfig: this.dripPosition.globalConfig,
                inputTokenFeeAccount,
                pairConfig: this.dripPosition.pairConfig,
                dripPosition: this.dripPositionPublicKey,
                dripPositionSigner: dripPositionSigner,
                dripPositionInputTokenAccount:
                    this.dripPosition.inputTokenAccount,
                dripPositionOutputTokenAccount:
                    this.dripPosition.outputTokenAccount,
                dripperInputTokenAccount,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction();
        ixs.push(preDripIx);
        ixs.push(...swapIxs);
        const postDripIx = await this.program.methods
            .postDrip()
            .accounts({
                signer: this.provider.publicKey,
                globalConfig: this.dripPosition.globalConfig,
                outputTokenFeeAccount,
                pairConfig: this.dripPosition.pairConfig,
                dripPosition: this.dripPositionPublicKey,
                dripPositionSigner: dripPositionSigner,
                dripPositionInputTokenAccount:
                    this.dripPosition.inputTokenAccount,
                dripPositionOutputTokenAccount:
                    this.dripPosition.outputTokenAccount,
                dripperInputTokenAccount,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
            })
            .instruction();
        ixs.push(postDripIx);
        return ixs;
    }

    private async createLookupTables(
        dripIxs: TransactionInstruction[]
    ): Promise<{
        txSigs: string[];
        luts: AddressLookupTableAccount[];
    }> {
        console.log('creating luts');
        const accounts = dedupeInstructionsPublicKeys(dripIxs);

        // each row represents the instructions for a tx
        // const ixsForTxs: TransactionInstruction[][] = [];
        const lutAddresses: PublicKey[] = [];

        // TODO: do we need a new slot per LUT?
        // console.log('currentSlot:', currentSlot);
        // const slots = await this.provider.connection.getBlocks(currentSlot - Math.round(accounts.length / ACCOUNTS_PER_LUT) + 1, currentSlot, 'finalized');
        // if (slots.length < 100) {
        //     throw new Error(`Could find only ${slots.length} ${slots} on the main fork`);
        // }

        // let currentSlot = -1;
        const txSigs: string[] = [];
        // paginate to create each lut
        await paginate(
            accounts,
            async (lutAccounts, page) => {
                const currentSlot = await this.provider.connection.getSlot(
                    DEFAULT_CONFIRM_OPTIONS.commitment
                );
                const [lookupTableInst, lookupTableAddress] =
                    AddressLookupTableProgram.createLookupTable({
                        authority: this.provider.publicKey,
                        payer: this.provider.publicKey,
                        recentSlot: currentSlot - 1,
                    });
                console.log(`creating LUT ${lookupTableAddress}`);
                const [createLutTx] = await createVersionedTransactions(
                    this.provider.connection,
                    this.provider.publicKey,
                    [[lookupTableInst]]
                );
                lutAddresses.push(lookupTableAddress);
                // ixsForTxs.push([lookupTableInst]);
                txSigs.push(
                    await this.provider.sendAndConfirm(
                        createLutTx,
                        [],
                        DEFAULT_CONFIRM_OPTIONS
                    )
                );
                // paginate to populate lut
                await paginate(
                    lutAccounts,
                    async (extendLutAccounts) => {
                        console.log(`extending LUT ${lookupTableAddress}`);
                        const extendInstruction =
                            AddressLookupTableProgram.extendLookupTable({
                                payer: this.provider.publicKey,
                                authority: this.provider.publicKey,
                                lookupTable: lookupTableAddress,
                                addresses: extendLutAccounts,
                            });
                        const [extendLutTx] = await createVersionedTransactions(
                            this.provider.connection,
                            this.provider.publicKey,
                            [[extendInstruction]]
                        );
                        txSigs.push(
                            await this.provider.sendAndConfirm(
                                extendLutTx,
                                [],
                                DEFAULT_CONFIRM_OPTIONS
                            )
                        );
                    },
                    MAX_ACCOUNTS_PER_TX
                );
            },
            ACCOUNTS_PER_LUT
        );
        const currentSlot = await this.provider.connection.getSlot(
            DEFAULT_CONFIRM_OPTIONS.commitment
        );

        // const txs = await createVersionedTransactions(
        //     this.provider.connection,
        //     this.provider.publicKey,
        //     ixsForTxs
        // );
        // console.log(`creating luts takes ${txs.length} transactions`)

        // for (let i = 0; i < txs.length; i++) {
        //     const tx = txs[i];
        //     // https://solana.stackexchange.com/questions/2896/what-does-transaction-address-table-lookup-uses-an-invalid-index-mean
        //     // waiting for finalization after creating lut should be enough of a delay
        //     // const options = i === 0 ? CREATE_LUT_CONFIRM_OPTIONS : DEFAULT_CONFIRM_OPTIONS
        //     const txSig = await this.provider.sendAndConfirm(tx, [], CREATE_LUT_CONFIRM_OPTIONS)
        //     txSigs.push(txSig)
        // }
        const latestBlockHash =
            await this.provider.connection.getLatestBlockhash(
                DEFAULT_CONFIRM_OPTIONS.commitment
            );
        for (const txSig of txSigs) {
            console.log(`waiting for ${txSig} to finalize`);
            await this.provider.connection.confirmTransaction(
                {
                    ...latestBlockHash,
                    signature: txSig,
                },
                DEFAULT_CONFIRM_OPTIONS.commitment
            );
        }
        // TODO clean this up
        for (let i = 0; i < 3; i++) {
            const slot = await this.provider.connection.getSlot(
                DEFAULT_CONFIRM_OPTIONS.commitment
            );
            if (slot >= currentSlot + 1) {
                break;
            } else if (i === 2) {
                throw new Error(
                    "TODO: couldn't find a slot greater than currentSlot + 1 after 3 tries"
                );
            }
            await delay(500);
        }
        const luts = await Promise.all(
            lutAddresses.map((lutAddress) =>
                this.provider.connection.getAddressLookupTable(lutAddress, {
                    commitment: DEFAULT_CONFIRM_OPTIONS.commitment,
                    minContextSlot: currentSlot + 1,
                })
            )
        );
        console.log(`created ${luts.length} luts`);
        return {
            txSigs,
            luts: luts.map((lut) => {
                assert(lut.value, new Error('TODO'));
                return lut.value;
            }),
        };
    }

    // TODO: Add worker to close all deactivated lookup tables
    private async deactivateLookupTables(
        luts: AddressLookupTableAccount[]
    ): Promise<string> {
        const closeLutIxs = luts.map((lut) =>
            AddressLookupTableProgram.deactivateLookupTable({
                lookupTable: lut.key,
                authority: this.provider.publicKey,
            })
        );
        const [tx] = await createVersionedTransactions(
            this.provider.connection,
            this.provider.publicKey,
            [closeLutIxs],
            luts
        );
        assert(tx, new Error('TODO'));
        return await this.provider.sendAndConfirm(
            tx,
            [],
            DEFAULT_CONFIRM_OPTIONS
        );
    }

    async maybeInitAta(
        mint: PublicKey,
        owner: PublicKey,
        allowOwnerOffCurve = false
    ): Promise<{
        address: PublicKey;
        instruction?: TransactionInstruction;
    }> {
        const ata = await getAssociatedTokenAddress(
            mint,
            owner,
            allowOwnerOffCurve
        );
        let ix: TransactionInstruction | undefined = undefined;
        if ((await this.provider.connection.getAccountInfo(ata)) === null) {
            ix = createAssociatedTokenAccountInstruction(
                this.provider.publicKey,
                ata,
                owner,
                mint
            );
        }
        return {
            address: ata,
            instruction: ix,
        };
    }

    // async getPositionSigner(): Promise
}
