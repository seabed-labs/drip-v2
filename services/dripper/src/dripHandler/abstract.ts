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
    deriveGlobalConfigSigner,
    derivePositionSigner,
    maybeInitAta,
    paginate,
    tryWithReturn,
} from '../utils';
import assert from 'assert';
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor';
import { createVersionedTransactions } from '../solana';
import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';
import {
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token-0-3-8';
import { DripPosition } from '../positions';

const MAX_ACCOUNTS_PER_TX = 20;
const ACCOUNTS_PER_LUT = 256;
const APPROX_TIME_PER_SLOT_MS = 400;
const GET_NEXT_SLOT_MAX_TRY = 3;

export abstract class PositionHandlerBase implements ITokenSwapHandler {
    protected constructor(
        readonly provider: AnchorProvider,
        readonly program: Program<DripV2>,
        readonly dripPosition: DripPosition
    ) {}

    abstract createSwapInstructions(): Promise<SwapQuoteWithInstructions>;

    async getPairConfig(): Promise<Accounts.PairConfig> {
        const pairConfig = await Accounts.PairConfig.fetch(
            this.provider.connection,
            this.dripPosition.data.pairConfig,
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
        // TODO(#109): Set oracle config if not already set
        return undefined;
    }

    async drip(): Promise<string> {
        console.log(`dripping ${this.dripPosition.address.toString()}`);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // setup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        await tryWithReturn(async () => {
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
        });

        const { inputAmount, minOutputAmount, ...swapIxs } =
            await tryWithReturn(async () => {
                return await this.createSwapInstructions();
            });

        // swap tx setup
        if (swapIxs.preSwapInstructions.length) {
            await tryWithReturn(async () => {
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
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // drip
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        const { dripIxsWithSandwich, luts } = await tryWithReturn(async () => {
            const dripIxsWithSandwich = await this.createDripSandwich(
                swapIxs.swapInstructions,
                inputAmount,
                minOutputAmount
            );
            const { txSigs: createLutsTxSigs, luts } =
                await this.createLookupTables(dripIxsWithSandwich);
            console.log(
                `created luts in txs ${JSON.stringify(createLutsTxSigs)}`
            );
            return {
                dripIxsWithSandwich,
                luts,
            };
        });
        const dripTxSig = await tryWithReturn(async () => {
            const [dripTx] = await createVersionedTransactions(
                this.provider.connection,
                this.provider.publicKey,
                [dripIxsWithSandwich],
                luts
            );
            return this.provider.sendAndConfirm(dripTx, [], {
                ...DEFAULT_CONFIRM_OPTIONS,
                // TODO: Remove
                // skipPreflight: true,
            });
        });
        console.log('dripTxSig', dripTxSig);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // cleanup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (swapIxs.postSwapInstructions.length) {
            await tryWithReturn(
                async () => {
                    const [postSwapCleanupTx] =
                        await createVersionedTransactions(
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
                },
                (e) => {
                    console.log('failed to execute postSwapCleanup');
                    console.error(e);
                }
            );
        }

        await tryWithReturn(
            async () => {
                const deactivateLutTxSig = await this.deactivateLookupTables(
                    luts
                );
                console.log('deactivateLutTxSig', deactivateLutTxSig);
            },
            (e) => {
                console.log('failed to execute postSwapCleanup');
                console.error(e);
            }
        );

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
                this.dripPosition.data.globalConfig.toBuffer(),
            ],
            this.program.programId
        );
        const { instruction: initInputTokenFeeAccount } = await maybeInitAta(
            this.provider.connection,
            this.provider.publicKey,
            this.dripPosition.data.inputTokenMint,
            globalConfigSigner,
            true
        );
        if (initInputTokenFeeAccount) {
            ixs.push(initInputTokenFeeAccount);
        }
        const { instruction: initOutputTokenFeeAccount } = await maybeInitAta(
            this.provider.connection,
            this.provider.publicKey,
            this.dripPosition.data.outputTokenMint,
            globalConfigSigner,
            true
        );
        if (initOutputTokenFeeAccount) {
            ixs.push(initOutputTokenFeeAccount);
        }
        const { instruction: initDripperInputTokenAccount } =
            await maybeInitAta(
                this.provider.connection,
                this.provider.publicKey,
                this.dripPosition.data.inputTokenMint,
                this.provider.publicKey
            );
        if (initDripperInputTokenAccount) {
            ixs.push(initDripperInputTokenAccount);
        }
        const { instruction: initDripperOutputTokenAccount } =
            await maybeInitAta(
                this.provider.connection,
                this.provider.publicKey,
                this.dripPosition.data.outputTokenMint,
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
        const [globalConfigSigner, dripPositionSigner] = [
            deriveGlobalConfigSigner(
                this.dripPosition.data.globalConfig,
                this.program.programId
            ),
            derivePositionSigner(
                this.dripPosition.address,
                this.program.programId
            ),
        ];
        const [
            inputTokenFeeAccount,
            outputTokenFeeAccount,
            dripperInputTokenAccount,
        ] = await Promise.all([
            getAssociatedTokenAddress(
                this.dripPosition.data.inputTokenMint,
                globalConfigSigner,
                true
            ),
            getAssociatedTokenAddress(
                this.dripPosition.data.outputTokenMint,
                globalConfigSigner,
                true
            ),
            getAssociatedTokenAddress(
                this.dripPosition.data.inputTokenMint,
                this.provider.publicKey
            ),
        ]);
        const preDripIx = await this.program.methods
            .preDrip({
                dripAmountToFill: new BN(dripAmountToFill.toString()),
                minimumOutputTokensExpected: new BN(
                    minimumOutputTokensExpected.toString()
                ),
            })
            .accounts({
                signer: this.provider.publicKey,
                globalConfig: this.dripPosition.data.globalConfig,
                inputTokenFeeAccount,
                pairConfig: this.dripPosition.data.pairConfig,
                dripPosition: this.dripPosition.address,
                dripPositionSigner: dripPositionSigner,
                dripPositionInputTokenAccount:
                    this.dripPosition.data.inputTokenAccount,
                dripPositionOutputTokenAccount:
                    this.dripPosition.data.outputTokenAccount,
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
                globalConfig: this.dripPosition.data.globalConfig,
                outputTokenFeeAccount,
                pairConfig: this.dripPosition.data.pairConfig,
                dripPosition: this.dripPosition.address,
                dripPositionSigner: dripPositionSigner,
                dripPositionInputTokenAccount:
                    this.dripPosition.data.inputTokenAccount,
                dripPositionOutputTokenAccount:
                    this.dripPosition.data.outputTokenAccount,
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
        const lutAddresses: PublicKey[] = [];
        const txSigs: string[] = [];

        // TODO: Mocha, read up in depth on how lut activation/extensions work
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
        const nextSlot = await this.getNextSlotWithRetry(
            currentSlot,
            0,
            GET_NEXT_SLOT_MAX_TRY
        );
        const getLuts = lutAddresses.map((lutAddress) =>
            this.provider.connection.getAddressLookupTable(lutAddress, {
                commitment: DEFAULT_CONFIRM_OPTIONS.commitment,
                minContextSlot: nextSlot,
            })
        );
        const luts = (await Promise.all(getLuts)).map((lut) => {
            assert(lut.value, new Error('TODO'));
            return lut.value;
        });
        console.log(`created ${luts.length} luts`);
        return {
            txSigs,
            luts,
        };
    }

    // TODO(#110): Add worker to close all deactivated lookup tables
    private async deactivateLookupTables(
        luts: AddressLookupTableAccount[]
    ): Promise<string> {
        const deactivateLutIxs = luts.map((lut) =>
            AddressLookupTableProgram.deactivateLookupTable({
                lookupTable: lut.key,
                authority: this.provider.publicKey,
            })
        );
        const [tx] = await createVersionedTransactions(
            this.provider.connection,
            this.provider.publicKey,
            [deactivateLutIxs],
            luts
        );
        assert(tx, new Error('TODO'));
        return await this.provider.sendAndConfirm(
            tx,
            [],
            DEFAULT_CONFIRM_OPTIONS
        );
    }

    async getNextSlotWithRetry(
        currentSlot: number,
        tryCount: number,
        maxTryLimit: number
    ): Promise<number> {
        if (tryCount >= maxTryLimit) {
            throw new Error(
                `TODO: couldn't find a slot greater than ${currentSlot} after ${maxTryLimit} tries`
            );
        }
        const slot = await this.provider.connection.getSlot(
            DEFAULT_CONFIRM_OPTIONS.commitment
        );
        if (slot >= currentSlot + 1) {
            return slot;
        }
        await delay(APPROX_TIME_PER_SLOT_MS);
        return this.getNextSlotWithRetry(
            currentSlot,
            tryCount + 1,
            maxTryLimit
        );
    }
}
