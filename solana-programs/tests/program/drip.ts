import '../setup';
import {
    AnchorProvider,
    getProvider,
    Program,
    setProvider,
    workspace,
    BN,
} from '@coral-xyz/anchor';
import {
    deriveDripPositionSigner,
    deriveEphemeralDripState,
    deriveGlobalConfigSigner,
    derivePairConfig,
} from '@dcaf/drip/dist/utils/pda';
import { DripV2, PostDripAccounts, PreDripAccounts } from '@dcaf/drip-types';
import { DripPosition } from '@dcaf/drip-types/src/accounts';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createMint,
    createMintToInstruction,
    getAssociatedTokenAddressSync,
    mintTo,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccount,
    createBurnInstruction,
    getAssociatedTokenAddress,
} from '@solana/spl-token-0-3-8';
import {
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import { expect } from 'chai';

async function fundAccounts(
    provider: AnchorProvider,
    addresses: PublicKey[],
    amount: number | bigint
): Promise<void> {
    const transfers = addresses.map((address) =>
        SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: address,
            lamports: amount,
        })
    );
    const fundTx = new Transaction({
        feePayer: provider.publicKey,
        recentBlockhash: (await provider.connection.getRecentBlockhash())
            .blockhash,
    }).add(...transfers);

    await provider.sendAndConfirm(fundTx);
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyBps(input: bigint, bps: bigint): bigint {
    return (BigInt(input) * BigInt(bps)) / BigInt(10_000);
}

type CreateDripSandwich = (args: {
    dripAmountToFill: number | bigint;
    minimumOutputTokensExpected: number | bigint;
    preDripAccountOverrides: Partial<PreDripAccounts>;
    postDripAccountOverrides: Partial<PostDripAccounts>;
    dripIxs: TransactionInstruction[];
}) => Promise<Transaction>;

describe('Program - drip (pre/post)', () => {
    setProvider(AnchorProvider.env());
    const program = workspace.DripV2 as Program<DripV2>;
    const provider = getProvider() as AnchorProvider;
    // useful for debugging, but changes the error response from hex to number
    // provider.opts.skipPreflight = true;

    let superAdminKeypair: Keypair;
    let mintAuthority: Keypair;
    let positionOwnerKeypair: Keypair;
    let dripAuthorityKeypair: Keypair;

    let inputMint: PublicKey;
    let outputMint: PublicKey;
    let preDripAccounts: PreDripAccounts;
    let postDripAccounts: PostDripAccounts;

    // const inputTokenFeeBps = 100;
    const outputTokenFeeBps = 0;

    let createDripSandwich: CreateDripSandwich;

    beforeEach(async () => {
        dripAuthorityKeypair = new Keypair();
        superAdminKeypair = new Keypair();
        mintAuthority = new Keypair();
        positionOwnerKeypair = new Keypair();
        const globalConfigKeypair = new Keypair();
        const dripPositionKeypair = new Keypair();

        await fundAccounts(
            provider,
            [
                superAdminKeypair.publicKey,
                positionOwnerKeypair.publicKey,
                dripAuthorityKeypair.publicKey,
                mintAuthority.publicKey,
            ],
            100e9
        );

        const globalSignerPubkey = deriveGlobalConfigSigner(
            globalConfigKeypair.publicKey,
            program.programId
        );

        await program.methods
            .initGlobalConfig({
                superAdmin: superAdminKeypair.publicKey,
                defaultDripFeeBps: 100,
            })
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
                globalConfigSigner: globalSignerPubkey,
            })
            .signers([globalConfigKeypair])
            .rpc();

        await program.methods
            .updateAdmin({
                adminIndex: new BN(0),
                adminChange: {
                    setAdminAndResetPermissions: [
                        dripAuthorityKeypair.publicKey,
                    ],
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
            })
            .signers([superAdminKeypair])
            .rpc();

        await program.methods
            .updateAdmin({
                adminIndex: new BN(0),
                adminChange: {
                    addPermission: [{ drip: {} }],
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
            })
            .signers([superAdminKeypair])
            .rpc();

        [inputMint, outputMint] = await Promise.all([
            createMint(
                provider.connection,
                mintAuthority,
                mintAuthority.publicKey,
                null,
                6
            ),
            createMint(
                provider.connection,
                mintAuthority,
                mintAuthority.publicKey,
                null,
                6
            ),
        ]);
        const pairConfigPublicKey = derivePairConfig(
            globalConfigKeypair.publicKey,
            inputMint,
            outputMint,
            program.programId
        );
        await program.methods
            .initPairConfig()
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                inputTokenMint: inputMint,
                outputTokenMint: outputMint,
                pairConfig: pairConfigPublicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([])
            .rpc();

        const dripPositionSignerPubkey = deriveDripPositionSigner(
            dripPositionKeypair.publicKey,
            program.programId
        );

        const [
            dripPositionInputTokenAccountPublicKey,
            dripPositionOutputTokenAccountPublicKey,
        ] = [inputMint, outputMint].map((mint) =>
            getAssociatedTokenAddressSync(
                mint,
                dripPositionSignerPubkey,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )
        );

        const [
            dripperInputTokenAccountPublicKey,
            dripperOutputTokenAccountPublicKey,
        ] = await Promise.all(
            [inputMint, outputMint].map((mint) =>
                createAssociatedTokenAccount(
                    provider.connection,
                    dripAuthorityKeypair,
                    mint,
                    dripAuthorityKeypair.publicKey
                )
            )
        );
        const [inputTokenFeeAccountPublicKey, outputTokenFeeAccountPublicKey] =
            await Promise.all(
                [inputMint, outputMint].map((mint) =>
                    getAssociatedTokenAddress(mint, globalSignerPubkey, true)
                )
            );
        const createFeeTokenAccountIxs = [
            [inputTokenFeeAccountPublicKey, inputMint],
            [outputTokenFeeAccountPublicKey, outputMint],
        ].map(([taPublicKey, mint]) =>
            createAssociatedTokenAccountInstruction(
                provider.publicKey,
                taPublicKey,
                globalSignerPubkey,
                mint
            )
        );
        await provider.sendAndConfirm(
            new Transaction({ feePayer: provider.publicKey }).add(
                ...createFeeTokenAccountIxs
            )
        );

        await program.methods
            .initDripPosition({
                owner: positionOwnerKeypair.publicKey,
                dripAmount: new BN(1_000_000),
                frequencyInSeconds: new BN(1),
            })
            .accounts({
                payer: positionOwnerKeypair.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                pairConfig: pairConfigPublicKey,
                inputTokenMint: inputMint,
                outputTokenMint: outputMint,
                inputTokenAccount: dripPositionInputTokenAccountPublicKey,
                outputTokenAccount: dripPositionOutputTokenAccountPublicKey,
                dripPosition: dripPositionKeypair.publicKey,
                dripPositionSigner: dripPositionSignerPubkey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .signers([dripPositionKeypair, positionOwnerKeypair])
            .rpc();

        const ephemeralDripStatePublicKey = deriveEphemeralDripState(
            dripPositionKeypair.publicKey,
            program.programId
        );

        const commonAccounts = {
            dripAuthority: dripAuthorityKeypair.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
            pairConfig: pairConfigPublicKey,
            dripPosition: dripPositionKeypair.publicKey,
            dripPositionSigner: dripPositionSignerPubkey,
            ephemeralDripState: ephemeralDripStatePublicKey,
            dripPositionInputTokenAccount:
                dripPositionInputTokenAccountPublicKey,
            dripPositionOutputTokenAccount:
                dripPositionOutputTokenAccountPublicKey,
            dripperInputTokenAccount: dripperInputTokenAccountPublicKey,
            dripperOutputTokenAccount: dripperOutputTokenAccountPublicKey,
            instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
            tokenProgram: TOKEN_PROGRAM_ID,
        };
        preDripAccounts = {
            ...commonAccounts,
            systemProgram: SystemProgram.programId,
        };
        postDripAccounts = {
            ...commonAccounts,
            inputTokenFeeAccount: inputTokenFeeAccountPublicKey,
            outputTokenFeeAccount: outputTokenFeeAccountPublicKey,
        };

        createDripSandwich = async (args) => {
            const preDripIx = await program.methods
                .preDrip({
                    dripAmountToFill: new BN(args.dripAmountToFill.toString()),
                    minimumOutputTokensExpected: new BN(
                        args.minimumOutputTokensExpected.toString()
                    ),
                })
                .accounts({
                    ...preDripAccounts,
                    ...args.preDripAccountOverrides,
                })
                .instruction();
            const postDripIx = await program.methods
                .postDrip()
                .accounts({
                    ...postDripAccounts,
                    ...args.postDripAccountOverrides,
                })
                .instruction();

            return new Transaction({
                feePayer: dripAuthorityKeypair.publicKey,
                recentBlockhash: (
                    await provider.connection.getRecentBlockhash()
                ).blockhash,
            }).add(preDripIx, ...args.dripIxs, postDripIx);
        };
    });

    it('should fail if signer does not have permission', async () => {
        const preDripIx = await program.methods
            .preDrip({
                dripAmountToFill: new BN(0),
                minimumOutputTokensExpected: new BN(500_000),
            })
            .accounts({ ...preDripAccounts, dripAuthority: provider.publicKey })
            .instruction();
        const tx = new Transaction({
            feePayer: provider.publicKey,
            recentBlockhash: (await provider.connection.getRecentBlockhash())
                .blockhash,
        }).add(preDripIx);
        await expect(provider.sendAndConfirm(tx)).to.eventually.be.rejectedWith(
            /0x1774/
        );
    });

    it('should fail if post_drip is not in the same transaction', async () => {
        const dripPosition = await DripPosition.fetchNonNullable(
            provider.connection,
            preDripAccounts.dripPosition,
            program.programId
        );
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMint,
            preDripAccounts.dripPositionInputTokenAccount,
            mintAuthority,
            dripPosition.data.dripAmountPreFees
        );
        const preDripIx = await program.methods
            .preDrip({
                dripAmountToFill: new BN(0),
                minimumOutputTokensExpected: new BN(500_000),
            })
            .accounts(preDripAccounts)
            .instruction();
        const tx = new Transaction({
            feePayer: dripAuthorityKeypair.publicKey,
            recentBlockhash: (await provider.connection.getRecentBlockhash())
                .blockhash,
        }).add(preDripIx);
        tx.sign(dripAuthorityKeypair);
        await expect(
            sendAndConfirmTransaction(provider.connection, tx, [
                dripAuthorityKeypair,
            ])
        ).to.eventually.be.rejectedWith(/0x178b/);
    });

    it('should fail if no output tokens are received', async () => {
        const dripPosition = await DripPosition.fetchNonNullable(
            provider.connection,
            preDripAccounts.dripPosition,
            program.programId
        );
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMint,
            preDripAccounts.dripPositionInputTokenAccount,
            mintAuthority,
            dripPosition.data.dripAmountPreFees
        );
        const dripTx = await createDripSandwich({
            dripAmountToFill: 1,
            minimumOutputTokensExpected: 500_000,
            preDripAccountOverrides: {},
            postDripAccountOverrides: {},
            dripIxs: [],
        });
        dripTx.sign(dripAuthorityKeypair);
        await expect(
            sendAndConfirmTransaction(provider.connection, dripTx, [
                dripAuthorityKeypair,
            ])
        ).to.eventually.be.rejectedWith(/0x1795/);
    });

    [1, 2, 3].forEach((dripCount) => {
        it(`should drip ${dripCount} times with the full drip amount each time`, async () => {
            const dripPosition = await DripPosition.fetchNonNullable(
                provider.connection,
                preDripAccounts.dripPosition,
                program.programId
            );
            expect(
                dripPosition.data.dripAmountRemainingPostFeesInCurrentCycle.toString()
            ).to.not.equal('0');
            const depositAmount =
                BigInt(dripPosition.data.dripAmountPreFees) * BigInt(dripCount);
            await mintTo(
                provider.connection,
                mintAuthority,
                inputMint,
                preDripAccounts.dripPositionInputTokenAccount,
                mintAuthority,
                depositAmount
            );

            for (let i = 0; i < dripCount; i++) {
                const [
                    dripPositionBefore,
                    positionInputBalanceBefore,
                    positionOutputBalanceBefore,
                ] = await Promise.all([
                    DripPosition.fetchNonNullable(
                        provider.connection,
                        preDripAccounts.dripPosition,
                        program.programId
                    ),
                    provider.connection.getTokenAccountBalance(
                        preDripAccounts.dripPositionInputTokenAccount
                    ),
                    provider.connection.getTokenAccountBalance(
                        preDripAccounts.dripPositionOutputTokenAccount
                    ),
                ]);
                const dripAmountRemainingPostFeesInCurrentCycle = BigInt(
                    dripPositionBefore.data
                        .dripAmountRemainingPostFeesInCurrentCycle
                );
                const outputReceiveAmount =
                    dripAmountRemainingPostFeesInCurrentCycle / BigInt(2);
                const swapIxs = [
                    createBurnInstruction(
                        preDripAccounts.dripperInputTokenAccount,
                        inputMint,
                        dripAuthorityKeypair.publicKey,
                        dripAmountRemainingPostFeesInCurrentCycle
                    ),
                    createMintToInstruction(
                        outputMint,
                        preDripAccounts.dripperOutputTokenAccount,
                        mintAuthority.publicKey,
                        outputReceiveAmount
                    ),
                ];
                const dripTx = await createDripSandwich({
                    dripAmountToFill:
                        dripPositionBefore.data
                            .dripAmountRemainingPostFeesInCurrentCycle,
                    minimumOutputTokensExpected: outputReceiveAmount,
                    preDripAccountOverrides: {},
                    postDripAccountOverrides: {},
                    dripIxs: swapIxs,
                });
                dripTx.sign(dripAuthorityKeypair, mintAuthority);
                await sendAndConfirmTransaction(
                    provider.connection,
                    dripTx,
                    [dripAuthorityKeypair, mintAuthority],
                    { skipPreflight: true }
                );

                const [positionInputBalanceAfter, positionOutputBalanceAfter] =
                    await Promise.all([
                        provider.connection.getTokenAccountBalance(
                            preDripAccounts.dripPositionInputTokenAccount
                        ),
                        provider.connection.getTokenAccountBalance(
                            preDripAccounts.dripPositionOutputTokenAccount
                        ),
                    ]);

                expect(BigInt(positionInputBalanceAfter.value.amount)).to.equal(
                    BigInt(positionInputBalanceBefore.value.amount) -
                        BigInt(dripPositionBefore.data.dripAmountPreFees)
                );
                expect(
                    BigInt(positionOutputBalanceAfter.value.amount)
                ).to.equal(
                    BigInt(positionOutputBalanceBefore.value.amount) +
                        outputReceiveAmount
                );
                if (i !== dripCount - 1) {
                    await delay(
                        Number(dripPositionBefore.data.frequencyInSeconds) + 500
                    );
                }
            }
        });
    });

    it('should drip three times in the same cycle with partial drips', async () => {
        const dripPosition = await DripPosition.fetchNonNullable(
            provider.connection,
            preDripAccounts.dripPosition,
            program.programId
        );
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMint,
            preDripAccounts.dripPositionInputTokenAccount,
            mintAuthority,
            dripPosition.data.dripAmountPreFees
        );

        const dripCount = 3;
        for (let i = 0; i < dripCount; i++) {
            const dripPositionBefore = await DripPosition.fetchNonNullable(
                provider.connection,
                preDripAccounts.dripPosition,
                program.programId
            );

            const {
                partialDripAmount,
                expectedOutputFees,
                outputReceiveAmount,
            } = (() => {
                const dripAmountBefore = BigInt(
                    dripPositionBefore.data.dripAmountPreFees
                );
                const outputReceiveAmount = dripAmountBefore / BigInt(2);
                const expectedOutputFees = applyBps(
                    outputReceiveAmount,
                    BigInt(outputTokenFeeBps)
                );
                const partialDripAmount =
                    i < dripCount - 1
                        ? BigInt(dripAmountBefore / BigInt(dripCount))
                        : BigInt(
                              dripPositionBefore.data
                                  .dripAmountRemainingPostFeesInCurrentCycle
                          );
                return {
                    partialDripAmount,
                    expectedOutputFees,
                    outputReceiveAmount,
                };
            })();

            const swapIxs = [
                createBurnInstruction(
                    preDripAccounts.dripperInputTokenAccount,
                    inputMint,
                    dripAuthorityKeypair.publicKey,
                    partialDripAmount
                ),
                createMintToInstruction(
                    outputMint,
                    preDripAccounts.dripperOutputTokenAccount,
                    mintAuthority.publicKey,
                    outputReceiveAmount
                ),
            ];
            const dripTx = await createDripSandwich({
                dripAmountToFill: partialDripAmount,
                minimumOutputTokensExpected: outputReceiveAmount,
                preDripAccountOverrides: {},
                postDripAccountOverrides: {},
                dripIxs: swapIxs,
            });
            dripTx.sign(dripAuthorityKeypair, mintAuthority);
            await sendAndConfirmTransaction(
                provider.connection,
                dripTx,
                [dripAuthorityKeypair, mintAuthority],
                {
                    skipPreflight: true,
                }
            );

            const dripPositionAfter = await DripPosition.fetchNonNullable(
                provider.connection,
                preDripAccounts.dripPosition,
                program.programId
            );
            const dripPositionAfterJSON = dripPositionAfter.toJSON();
            const dripPositionBeforeJSON = dripPositionBefore.toJSON();

            expect({
                ...dripPositionAfterJSON,
                // These values are expected to change!
                // These are validated below
                dripActivationTimestamp: '0',
                dripAmountRemainingPostFeesInCurrentCycle: '0',
                dripInputFeesRemainingForCurrentCycle: '0',
                totalInputTokenDrippedPostFees: '0',
                totalOutputTokenReceivedPostFees: '0',
                totalInputFeesCollected: '0',
                totalOutputFeesCollected: '0',
                cycle: '0',
            }).to.deep.equal({
                ...dripPositionBeforeJSON,
                dripActivationTimestamp: '0',
                dripAmountRemainingPostFeesInCurrentCycle: '0',
                dripInputFeesRemainingForCurrentCycle: '0',
                totalInputTokenDrippedPostFees: '0',
                totalOutputTokenReceivedPostFees: '0',
                totalInputFeesCollected: '0',
                totalOutputFeesCollected: '0',
                cycle: '0',
            });
            expect(
                dripPositionBeforeJSON.totalInputTokenDrippedPostFees
            ).to.not.equal(
                dripPositionAfterJSON.totalInputTokenDrippedPostFees
            );
            expect(
                dripPositionBeforeJSON.totalOutputTokenReceivedPostFees
            ).to.not.equal(
                dripPositionAfterJSON.totalOutputTokenReceivedPostFees
            );
            expect(
                BigInt(dripPositionAfter.data.totalInputTokenDrippedPostFees)
            ).to.equal(
                BigInt(dripPositionBefore.data.totalInputTokenDrippedPostFees) +
                    BigInt(partialDripAmount)
            );
            expect(
                BigInt(dripPositionAfter.data.totalOutputFeesCollected)
            ).to.equal(
                BigInt(dripPositionAfter.data.totalOutputFeesCollected) +
                    BigInt(expectedOutputFees)
            );

            if (i < dripCount - 1) {
                expect(
                    BigInt(
                        dripPositionAfter.data
                            .dripAmountRemainingPostFeesInCurrentCycle
                    )
                ).to.equal(
                    BigInt(
                        dripPositionBefore.data
                            .dripAmountRemainingPostFeesInCurrentCycle
                    ) - BigInt(partialDripAmount)
                );
                expect(dripPositionAfterJSON.cycle).to.equal('0');
            } else {
                expect(
                    BigInt(
                        dripPositionAfter.data
                            .dripAmountRemainingPostFeesInCurrentCycle
                    )
                ).to.not.equal(
                    BigInt(
                        dripPositionBefore.data
                            .dripAmountRemainingPostFeesInCurrentCycle
                    ) - BigInt(partialDripAmount)
                );
                expect(dripPositionAfterJSON.cycle).to.equal('1');
            }

            if (i !== dripCount - 1) {
                await delay(Number(dripPosition.data.frequencyInSeconds) + 500);
            }
        }
    });
});
