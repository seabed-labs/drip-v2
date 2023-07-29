import assert from 'assert';

import { AnchorProvider } from '@coral-xyz/anchor';
import {
    deriveGlobalConfigSigner,
    deriveDripPositionSigner,
    deriveEphemeralDripState,
} from '@dcaf/drip/src/utils/pda';
import {
    DripPosition,
    DripPositionAccount,
    DripPositionAccountJSON,
    PairConfig,
    PairConfigAccount,
    PostDrip,
    PostDripAccounts,
    PreDrip,
    PreDripAccounts,
    PriceOracle,
} from '@dcaf/drip-types';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getAssociatedTokenAddressSync } from '@solana/spl-token-0-3-8';
import {
    AddressLookupTableAccount,
    AddressLookupTableProgram,
    PublicKey,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import { Logger } from 'winston';

import { createVersionedTransactions } from '../solana';
import { ISwapHandler } from '../swapHandler';
import {
    Common,
    DripPositionAccountWithAddress,
    DripPositionPendingDrip,
} from '../types';
import {
    tryWithReturn,
    DEFAULT_CONFIRM_OPTIONS,
    maybeInitAta,
    dedupeInstructionsPublicKeys,
    createLuts,
    getNextSlotWithRetry,
} from '../utils';

import { IPosition } from '.';

const GET_NEXT_SLOT_MAX_TRY = 3;
const LUT_NOT_FOUND = new Error(`lut not found`);

export class Position implements IPosition {
    constructor(
        private logger: Logger,
        private readonly programId: PublicKey,
        private readonly dripPositionPendingDrip: DripPositionPendingDrip,
        private readonly swapHandler: ISwapHandler
    ) {}

    get address(): PublicKey {
        return this.dripPositionPendingDrip.address;
    }
    get account(): DripPositionAccount {
        return this.dripPositionPendingDrip.data;
    }
    get accountWithAddress(): DripPositionAccountWithAddress {
        return {
            data: this.dripPositionPendingDrip.data,
            address: this.dripPositionPendingDrip.address,
        };
    }

    toJSON(): DripPositionAccountJSON {
        return DripPosition.toJSON(this.dripPositionPendingDrip.data);
    }

    async drip(provider: AnchorProvider): Promise<string> {
        this.logger.info('starting drip');

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // setup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        const pairConfig = await tryWithReturn(
            this.logger.data({
                pairConfig: this.account.pairConfig,
            }),
            async () =>
                PairConfig.fetchNonNullableData(
                    provider.connection,
                    this.account.pairConfig,
                    this.programId,
                    DEFAULT_CONFIRM_OPTIONS
                )
        );
        await tryWithReturn(
            this.logger.data({ fn: 'drip setup tx' }),
            async () => {
                // create token accounts and setup oracle if needed
                await this.dripSetup(provider, pairConfig);
            }
        );

        const { inputAmount, minOutputAmount, ...swapIxs } =
            await tryWithReturn(
                this.logger.data({ fn: 'createSwapInstructions' }),
                async () => {
                    return await this.swapHandler.createSwapInstructions(
                        this.dripPositionPendingDrip,
                        await PairConfig.fetchNonNullableData(
                            provider.connection,
                            this.account.pairConfig,
                            this.programId,
                            DEFAULT_CONFIRM_OPTIONS
                        )
                    );
                }
            );

        // swap tx setup
        if (swapIxs.preSwapInstructions.length) {
            await tryWithReturn(
                this.logger.data({ fn: 'pre swap tx' }),
                async () => {
                    const [preSwapSetupTx] = await createVersionedTransactions(
                        provider.connection,
                        provider.publicKey,
                        [swapIxs.preSwapInstructions]
                    );
                    const swagSetupTxSig = await provider.sendAndConfirm(
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
                    provider.publicKey,
                    pairConfig,
                    swapIxs.swapInstructions,
                    inputAmount,
                    minOutputAmount
                );
                const luts = await this.createLookupTables(
                    provider,
                    dripIxsWithSandwich
                );
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
                    provider.connection,
                    provider.publicKey,
                    [dripIxsWithSandwich],
                    luts
                );
                const txSig = provider.sendAndConfirm(dripTx, [], {
                    ...DEFAULT_CONFIRM_OPTIONS,
                });
                this.logger
                    .data({ txSig: dripTxSig })
                    .info('broadcasted drip tx');
                return txSig;
            },
            (e) => {
                this.logger
                    .data({ error: e })
                    .error(
                        'failed to broadcast drip sandwich, continuing to cleanup...'
                    );
                return undefined;
            }
        );

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // cleanup
        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (swapIxs.postSwapInstructions.length) {
            await tryWithReturn(
                this.logger.data({ fn: 'post swap tx' }),
                async () => {
                    const [postSwapCleanupTx] =
                        await createVersionedTransactions(
                            provider.connection,
                            provider.publicKey,
                            [swapIxs.postSwapInstructions]
                        );
                    const postSwapTxSig = await provider.sendAndConfirm(
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
                        .error(
                            'failed to broadcast post swap tx, continuing...'
                        );
                }
            );
        }

        await tryWithReturn(
            this.logger.data({ fn: 'deactivate lut tx' }),
            async () => {
                const deactivateLutTxSig = await this.deactivateLookupTables(
                    provider,
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
                        'failed to broadcast deactivate luts tx, continuing...'
                    );
            }
        );

        if (!dripTxSig) {
            throw new Error('failed to drip');
        }
        this.logger.info('finished drip successfully, exiting.');
        return dripTxSig;
    }

    async createUpdatePairConfigOracleIx(
        pairConfig: PairConfigAccount
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

    async dripSetup(
        provider: AnchorProvider,
        pairConfig: PairConfigAccount
    ): Promise<string | undefined> {
        const ixs: TransactionInstruction[] = [];
        const updatePairConfigOracleIx =
            await this.createUpdatePairConfigOracleIx(pairConfig);
        if (updatePairConfigOracleIx) {
            ixs.push(updatePairConfigOracleIx);
        }
        const globalConfigSigner = deriveGlobalConfigSigner(
            this.account.globalConfig,
            this.programId
        );
        const { instruction: initInputTokenFeeAccount } = await maybeInitAta(
            provider.connection,
            provider.publicKey,
            pairConfig.inputTokenMint,
            globalConfigSigner,
            true
        );
        if (initInputTokenFeeAccount) {
            ixs.push(initInputTokenFeeAccount);
        }
        const { instruction: initOutputTokenFeeAccount } = await maybeInitAta(
            provider.connection,
            provider.publicKey,
            pairConfig.outputTokenMint,
            globalConfigSigner,
            true
        );
        if (initOutputTokenFeeAccount) {
            ixs.push(initOutputTokenFeeAccount);
        }
        const { instruction: initDripperInputTokenAccount } =
            await maybeInitAta(
                provider.connection,
                provider.publicKey,
                pairConfig.inputTokenMint,
                provider.publicKey
            );
        if (initDripperInputTokenAccount) {
            ixs.push(initDripperInputTokenAccount);
        }
        const { instruction: initDripperOutputTokenAccount } =
            await maybeInitAta(
                provider.connection,
                provider.publicKey,
                pairConfig.outputTokenMint,
                provider.publicKey
            );
        if (initDripperOutputTokenAccount) {
            ixs.push(initDripperOutputTokenAccount);
        }
        this.logger
            .data({ dripSetupIxsLength: ixs.length })
            .info('created drip setup ixs');
        if (ixs.length > 0) {
            const dripSetupTxSig = await provider.sendAndConfirm(
                new Transaction().add(...ixs),
                [],
                DEFAULT_CONFIRM_OPTIONS
            );
            this.logger
                .data({ txSig: dripSetupTxSig })
                .info('broadcasted drip setup tx');
            return dripSetupTxSig;
        }
        return undefined;
    }

    async createDripSandwich(
        dripper: PublicKey,
        pairConfig: PairConfigAccount,
        swapIxs: TransactionInstruction[],
        dripAmountToFill: bigint,
        minimumOutputTokensExpected: bigint
    ): Promise<TransactionInstruction[]> {
        const ixs: TransactionInstruction[] = [];
        const [globalConfigSigner, dripPositionSigner, ephemeralDripState] = [
            deriveGlobalConfigSigner(this.account.globalConfig, this.programId),
            deriveDripPositionSigner(this.address, this.programId),
            deriveEphemeralDripState(this.address, this.programId),
        ];
        const [
            inputTokenFeeAccount,
            outputTokenFeeAccount,
            dripperInputTokenAccount,
            dripperOutputTokenAccount,
        ] = [
            getAssociatedTokenAddressSync(
                pairConfig.inputTokenMint,
                globalConfigSigner,
                true
            ),
            getAssociatedTokenAddressSync(
                pairConfig.outputTokenMint,
                globalConfigSigner,
                true
            ),
            getAssociatedTokenAddressSync(pairConfig.inputTokenMint, dripper),
            getAssociatedTokenAddressSync(pairConfig.outputTokenMint, dripper),
        ];
        const prePostCommonAccounts: Common<PreDripAccounts, PostDripAccounts> =
            {
                dripAuthority: dripper,
                globalConfig: this.account.globalConfig,
                pairConfig: this.account.pairConfig,
                dripPosition: this.address,
                dripPositionSigner,
                ephemeralDripState,
                dripPositionInputTokenAccount: this.account.inputTokenAccount,
                dripPositionOutputTokenAccount: this.account.outputTokenAccount,
                dripperInputTokenAccount,
                dripperOutputTokenAccount,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
            };
        const preDripIx = new PreDrip({
            args: {
                params: {
                    dripAmountToFill,
                    minimumOutputTokensExpected,
                },
            },
            accounts: {
                ...prePostCommonAccounts,
                systemProgram: SystemProgram.programId,
            },
        }).build(this.programId);
        ixs.push(preDripIx);
        ixs.push(...swapIxs);
        const postDripIx = new PostDrip({
            args: null,
            accounts: {
                ...prePostCommonAccounts,
                inputTokenFeeAccount,
                outputTokenFeeAccount,
            },
        }).build(this.programId);
        ixs.push(postDripIx);
        this.logger.info('created drip sandwich ixs');
        return ixs;
    }

    async createLookupTables(
        provider: AnchorProvider,
        dripIxs: TransactionInstruction[]
    ): Promise<AddressLookupTableAccount[]> {
        this.logger.info('creating luts');
        const accounts = dedupeInstructionsPublicKeys(dripIxs);

        const { lutAddresses, txSigs } = await createLuts(
            provider,
            this.logger,
            accounts
        );

        const [currentSlot, latestBlockHash] = await Promise.all([
            provider.connection.getSlot(DEFAULT_CONFIRM_OPTIONS.commitment),
            await provider.connection.getLatestBlockhash(
                DEFAULT_CONFIRM_OPTIONS.commitment
            ),
        ]);

        const waitForConfirmations = txSigs.map((txSig) => {
            return provider.connection.confirmTransaction(
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
            provider.connection,
            currentSlot,
            0,
            GET_NEXT_SLOT_MAX_TRY
        );
        const getLuts = lutAddresses.map((lutAddress) =>
            provider.connection.getAddressLookupTable(lutAddress, {
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

    async deactivateLookupTables(
        provider: AnchorProvider,
        luts: AddressLookupTableAccount[]
    ): Promise<string> {
        const deactivateLutIxs = luts.map((lut) =>
            AddressLookupTableProgram.deactivateLookupTable({
                lookupTable: lut.key,
                authority: provider.publicKey,
            })
        );
        const [tx] = await createVersionedTransactions(
            provider.connection,
            provider.publicKey,
            [deactivateLutIxs],
            luts
        );
        assert(tx, new Error('TODO'));
        return await provider.sendAndConfirm(tx, [], DEFAULT_CONFIRM_OPTIONS);
    }
}
