import { Accounts, DripV2 } from '@dcaf/drip-types';
import { PriceOracle } from '@dcaf/drip-types/src/types';
import {
    AddressLookupTableAccount,
    AddressLookupTableProgram,
    Keypair,
    PublicKey,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    createLuts,
    dedupeInstructionsPublicKeys,
    DEFAULT_CONFIRM_OPTIONS,
    deriveGlobalConfigSigner,
    derivePositionSigner,
    getNextSlotWithRetry,
    maybeInitAta,
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
import { Logger } from 'winston';
import { DripperWallet } from '../wallet/dripperWallet';

const GET_NEXT_SLOT_MAX_TRY = 3;

const PAIR_CONFIG_NOT_FOUND = (address: PublicKey) =>
    new Error(`pair config ${address.toString()} not found`);
const LUT_NOT_FOUND = new Error(`lut not found`);

export abstract class PositionHandlerBase implements ITokenSwapHandler {
    readonly logger: Logger;
    readonly positionKeypair: Keypair;
    protected constructor(
        baseLogger: Logger,
        readonly dripperWallet: DripperWallet,
        readonly provider: AnchorProvider,
        readonly program: Program<DripV2>,
        readonly dripPosition: DripPosition
    ) {
        assert(
            dripperWallet.publicKey.toString() ===
                provider.publicKey.toString(),
            new Error(
                `provider publicKey ${provider.publicKey.toString()} does not match dripper wallet public key ${dripperWallet.publicKey.toString()}`
            )
        );
        this.positionKeypair = dripperWallet.derivePositionKeyPair(
            dripPosition.address
        );
        this.logger = baseLogger.child({
            dripPositionPublicKey: dripPosition.address.toString(),
            dripPositionGlobalConfigPublicKey:
                dripPosition.data.globalConfig.toString(),
            dripPositionPairConfigPublicKey:
                dripPosition.data.pairConfig.toString(),
            dripPositionInputTokenMintPublicKey:
                dripPosition.data.inputTokenMint.toString(),
            dripPositionOutputTokenMintPublicKey:
                dripPosition.data.outputTokenMint.toString(),
            dripperPublicKey: dripperWallet.publicKey.toString(),
            dripperPositionPublicKeyL:
                this.positionKeypair.publicKey.toString(),
            programId: program.programId.toString(),
        });
    }

    abstract createSwapInstructions(): Promise<SwapQuoteWithInstructions>;

    async getPairConfig(): Promise<Accounts.PairConfig> {
        const pairConfig = await Accounts.PairConfig.fetch(
            this.provider.connection,
            this.dripPosition.data.pairConfig,
            this.program.programId
        );
        if (!pairConfig) {
            this.logger
                .data({
                    pairConfigPublicKey:
                        this.dripPosition.data.pairConfig.toString(),
                })
                .error('not found');
            throw PAIR_CONFIG_NOT_FOUND(this.dripPosition.data.pairConfig);
        }
        return pairConfig;
    }

    async createUpdatePairConfigOracleIx(
        pairConfig: Accounts.PairConfig
    ): Promise<TransactionInstruction | undefined> {
        if (
            pairConfig.inputTokenPriceOracle.kind !==
                PriceOracle.Unavailable.kind &&
            pairConfig.outputTokenPriceOracle.kind !==
                PriceOracle.Unavailable.kind
        ) {
            return undefined;
        }
        // TODO(#109): Set oracle config if not already set
        return undefined;
    }

    async drip(): Promise<string> {
        this.logger.info('starting drip');

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // setup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        await tryWithReturn(
            this.logger.data({ fn: 'drip setup tx' }),
            async () => {
                // create token accounts and setup oracle if needed
                const setupIxs = await this.dripSetup();
                if (setupIxs.length) {
                    const dripSetupTxSig = await this.provider.sendAndConfirm(
                        new Transaction().add(...setupIxs),
                        [],
                        DEFAULT_CONFIRM_OPTIONS
                    );
                    this.logger
                        .data({ txSig: dripSetupTxSig })
                        .info('broadcasted drip setup tx');
                }
            }
        );

        const { inputAmount, minOutputAmount, ...swapIxs } =
            await tryWithReturn(
                this.logger.data({ fn: 'createSwapInstructions' }),
                async () => {
                    return await this.createSwapInstructions();
                }
            );

        // swap tx setup
        if (swapIxs.preSwapInstructions.length) {
            await tryWithReturn(
                this.logger.data({ fn: 'pre swap tx' }),
                async () => {
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
                    this.logger
                        .data({ txSig: swagSetupTxSig })
                        .info('broadcasted pre swap tx');
                }
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // drip
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        const { dripIxsWithSandwich, luts } = await tryWithReturn(
            this.logger.data({ fn: 'dripSandwich' }),
            async () => {
                const dripIxsWithSandwich = await this.createDripSandwich(
                    swapIxs.swapInstructions,
                    inputAmount,
                    minOutputAmount
                );
                const luts = await this.createLookupTables(dripIxsWithSandwich);
                return {
                    dripIxsWithSandwich,
                    luts,
                };
            }
        );
        const dripTxSig = await tryWithReturn(
            this.logger.data({ fn: 'drip tx' }),
            async () => {
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
            }
        );
        this.logger.data({ txSig: dripTxSig }).info('broadcasted drip tx');

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // cleanup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (swapIxs.postSwapInstructions.length) {
            await tryWithReturn(
                this.logger.data({ fn: 'post swap tx' }),
                async () => {
                    const [postSwapCleanupTx] =
                        await createVersionedTransactions(
                            this.provider.connection,
                            this.provider.publicKey,
                            [swapIxs.postSwapInstructions]
                        );
                    const postSwapTxSig = await this.provider.sendAndConfirm(
                        postSwapCleanupTx,
                        [],
                        DEFAULT_CONFIRM_OPTIONS
                    );
                    this.logger
                        .data({ txSig: postSwapTxSig })
                        .info('broadcasted post swap tx');
                },
                (e) => {
                    this.logger
                        .data({ error: e })
                        .error('failed to broadcast post swap tx, continuing');
                }
            );
        }

        await tryWithReturn(
            this.logger.data({ fn: 'deactivate lut tx' }),
            async () => {
                const deactivateLutTxSig = await this.deactivateLookupTables(
                    luts
                );
                this.logger
                    .data({ txSig: deactivateLutTxSig })
                    .info('broadcasted deactivate luts tx');
            },
            (e) => {
                this.logger
                    .data({ error: e })
                    .error(
                        'failed to broadcast deactivate luts tx, continuing'
                    );
            }
        );

        return dripTxSig;
    }

    private async dripSetup(): Promise<TransactionInstruction[]> {
        const ixs: TransactionInstruction[] = [];
        const pairConfig = await this.getPairConfig();
        const updatePairConfigOracleIx =
            await this.createUpdatePairConfigOracleIx(pairConfig);
        if (updatePairConfigOracleIx) {
            ixs.push(updatePairConfigOracleIx);
        }
        const globalConfigSigner = deriveGlobalConfigSigner(
            this.dripPosition.data.globalConfig,
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
        this.logger
            .data({ dripSetupIxsLength: ixs.length })
            .info('created drip setup ixs');
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
        this.logger.info('created drip sandwich ixs');
        return ixs;
    }

    private async createLookupTables(
        dripIxs: TransactionInstruction[]
    ): Promise<AddressLookupTableAccount[]> {
        this.logger.info('creating luts');
        const accounts = dedupeInstructionsPublicKeys(dripIxs);

        const { lutAddresses, txSigs } = await createLuts(
            this.provider,
            this.logger,
            accounts
        );

        const [currentSlot, latestBlockHash] = await Promise.all([
            this.provider.connection.getSlot(
                DEFAULT_CONFIRM_OPTIONS.commitment
            ),
            await this.provider.connection.getLatestBlockhash(
                DEFAULT_CONFIRM_OPTIONS.commitment
            ),
        ]);

        const waitForConfirmations = txSigs.map((txSig) => {
            return this.provider.connection.confirmTransaction(
                {
                    ...latestBlockHash,
                    signature: txSig,
                },
                DEFAULT_CONFIRM_OPTIONS.commitment
            );
        });
        this.logger
            .data({ txSigs: txSigs })
            .info('waiting for lut sigs to finalize');
        await Promise.all(waitForConfirmations);

        const nextSlot = await getNextSlotWithRetry(
            this.provider.connection,
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
            assert(lut.value, LUT_NOT_FOUND);
            return lut.value;
        });
        this.logger
            .data({ lutsLength: luts.length })
            .info('created and extended luts');
        return luts;
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
}
