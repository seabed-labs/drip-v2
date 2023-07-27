import {
    Keypair,
    PublicKey,
    sendAndConfirmTransaction,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
} from '@solana/web3.js';
import {
    AnchorProvider,
    getProvider,
    Program,
    setProvider,
    workspace,
    BN,
} from '@coral-xyz/anchor';
import { DripV2 } from '@dcaf/drip-types';
import '../setup';
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
import { assert, expect } from 'chai';
import { DripPosition } from '@dcaf/drip-types/src/accounts';
function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function applyBps(input: bigint, bps: bigint): bigint {
    return (BigInt(input) * BigInt(bps)) / BigInt(10_000);
}

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

    let inputMintPublicKey: PublicKey;
    let outputMintPublicKey: PublicKey;
    let globalConfigPublicKey: PublicKey;
    let pairConfigPublicKey: PublicKey;
    let dripPositionPublicKey: PublicKey;
    let dripPositionSignerPubkey: PublicKey;
    let ephemeralDripStatePublicKey: PublicKey;
    let dripPositionInputTokenAccountPublicKey: PublicKey;
    let dripPositionOutputTokenAccountPublicKey: PublicKey;
    let dripperInputTokenAccountPublicKey: PublicKey;
    let dripperOutputTokenAccountPublicKey: PublicKey;
    let inputTokenFeeAccountPublicKey: PublicKey;
    let outputTokenFeeAccountPublicKey: PublicKey;

    const inputTokenFeeBps = 100;
    const outputTokenFeeBps = 0;

    beforeEach(async () => {
        dripAuthorityKeypair = new Keypair();
        superAdminKeypair = new Keypair();
        mintAuthority = new Keypair();
        positionOwnerKeypair = new Keypair();
        const globalConfigKeypair = new Keypair();
        globalConfigPublicKey = globalConfigKeypair.publicKey;
        const dripPositionKeypair = new Keypair();
        dripPositionPublicKey = dripPositionKeypair.publicKey;
        const fundTx = new Transaction({
            feePayer: provider.publicKey,
            recentBlockhash: (await provider.connection.getRecentBlockhash())
                .blockhash,
        }).add(
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: superAdminKeypair.publicKey,
                lamports: 100e9,
            }),
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: positionOwnerKeypair.publicKey,
                lamports: 100e9,
            }),
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: dripAuthorityKeypair.publicKey,
                lamports: 100e9,
            }),
            SystemProgram.transfer({
                fromPubkey: provider.publicKey,
                toPubkey: mintAuthority.publicKey,
                lamports: 100e9,
            })
        );
        await provider.sendAndConfirm(fundTx);

        const [globalSignerPubkey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-global-signer'),
                globalConfigKeypair.publicKey.toBuffer(),
            ],
            program.programId
        );

        await program.methods
            .initGlobalConfig({
                superAdmin: superAdminKeypair.publicKey,
                defaultDripFeeBps: new BN(100),
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
                globalConfig: globalConfigPublicKey,
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
                globalConfig: globalConfigPublicKey,
            })
            .signers([superAdminKeypair])
            .rpc();

        const inputTokenMintKeypair = new Keypair();
        inputMintPublicKey = inputTokenMintKeypair.publicKey;
        const outputTokenMintKeypair = new Keypair();
        outputMintPublicKey = outputTokenMintKeypair.publicKey;
        [inputMintPublicKey, outputMintPublicKey] = await Promise.all([
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
        [pairConfigPublicKey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-pair-config'),
                globalConfigPublicKey.toBuffer(),
                inputMintPublicKey.toBuffer(),
                outputMintPublicKey.toBuffer(),
            ],
            program.programId
        );
        await program.methods
            .initPairConfig()
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigPublicKey,
                inputTokenMint: inputMintPublicKey,
                outputTokenMint: outputMintPublicKey,
                pairConfig: pairConfigPublicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([])
            .rpc();

        [dripPositionSignerPubkey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-drip-position-signer'),
                dripPositionKeypair.publicKey.toBuffer(),
            ],
            program.programId
        );

        [
            dripPositionInputTokenAccountPublicKey,
            dripPositionOutputTokenAccountPublicKey,
        ] = [inputMintPublicKey, outputMintPublicKey].map((mint) =>
            getAssociatedTokenAddressSync(
                mint,
                dripPositionSignerPubkey,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            )
        );

        [
            dripperInputTokenAccountPublicKey,
            dripperOutputTokenAccountPublicKey,
        ] = await Promise.all(
            [inputMintPublicKey, outputMintPublicKey].map((mint) =>
                createAssociatedTokenAccount(
                    provider.connection,
                    dripAuthorityKeypair,
                    mint,
                    dripAuthorityKeypair.publicKey
                )
            )
        );
        [inputTokenFeeAccountPublicKey, outputTokenFeeAccountPublicKey] =
            await Promise.all(
                [inputMintPublicKey, outputMintPublicKey].map((mint) =>
                    getAssociatedTokenAddress(mint, globalSignerPubkey, true)
                )
            );
        const createFeeTokenAccountIxs = [
            [inputTokenFeeAccountPublicKey, inputMintPublicKey],
            [outputTokenFeeAccountPublicKey, outputMintPublicKey],
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
                globalConfig: globalConfigPublicKey,
                pairConfig: pairConfigPublicKey,
                inputTokenMint: inputMintPublicKey,
                outputTokenMint: outputMintPublicKey,
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

        [ephemeralDripStatePublicKey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-ephemeral-drip-state'),
                dripPositionPublicKey.toBuffer(),
            ],
            program.programId
        );
    });

    it('should fail if signer does not have permission', async () => {
        const preDripIx = await program.methods
            .preDrip({
                dripAmountToFill: new BN(0),
                minimumOutputTokensExpected: new BN(500_000),
            })
            .accounts({
                dripAuthority: provider.publicKey,
                globalConfig: globalConfigPublicKey,
                pairConfig: pairConfigPublicKey,
                dripPosition: dripPositionPublicKey,
                ephemeralDripState: ephemeralDripStatePublicKey,
                dripPositionInputTokenAccount:
                    dripPositionInputTokenAccountPublicKey,
                dripPositionOutputTokenAccount:
                    dripPositionOutputTokenAccountPublicKey,
                dripperInputTokenAccount: dripperInputTokenAccountPublicKey,
                dripperOutputTokenAccount: dripperOutputTokenAccountPublicKey,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,

                systemProgram: SystemProgram.programId,
            })
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
            dripPositionPublicKey,
            program.programId
        );
        assert(dripPosition);
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMintPublicKey,
            dripPositionInputTokenAccountPublicKey,
            mintAuthority,
            dripPosition.data.dripAmount
        );
        const preDripIx = await program.methods
            .preDrip({
                dripAmountToFill: new BN(0),
                minimumOutputTokensExpected: new BN(500_000),
            })
            .accounts({
                dripAuthority: dripAuthorityKeypair.publicKey,
                globalConfig: globalConfigPublicKey,
                pairConfig: pairConfigPublicKey,
                dripPosition: dripPositionPublicKey,
                ephemeralDripState: ephemeralDripStatePublicKey,
                dripPositionInputTokenAccount:
                    dripPositionInputTokenAccountPublicKey,
                dripPositionOutputTokenAccount:
                    dripPositionOutputTokenAccountPublicKey,
                dripperInputTokenAccount: dripperInputTokenAccountPublicKey,
                dripperOutputTokenAccount: dripperOutputTokenAccountPublicKey,
                instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,

                systemProgram: SystemProgram.programId,
            })
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
            dripPositionPublicKey,
            program.programId
        );
        assert(dripPosition);
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMintPublicKey,
            dripPositionInputTokenAccountPublicKey,
            mintAuthority,
            dripPosition.data.dripAmount
        );
        const commonAccounts = {
            dripAuthority: dripAuthorityKeypair.publicKey,
            globalConfig: globalConfigPublicKey,
            pairConfig: pairConfigPublicKey,
            dripPosition: dripPositionPublicKey,
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
        const preDripIx = await program.methods
            .preDrip({
                dripAmountToFill: new BN(1),
                minimumOutputTokensExpected: new BN(500_000),
            })
            .accounts({
                ...commonAccounts,
                systemProgram: SystemProgram.programId,
            })
            .instruction();
        const postDripIx = await program.methods
            .postDrip()
            .accounts({
                ...commonAccounts,
                inputTokenFeeAccount: inputTokenFeeAccountPublicKey,
                outputTokenFeeAccount: outputTokenFeeAccountPublicKey,
            })
            .instruction();

        const tx = new Transaction({
            feePayer: dripAuthorityKeypair.publicKey,
            recentBlockhash: (await provider.connection.getRecentBlockhash())
                .blockhash,
        }).add(preDripIx, postDripIx);
        tx.sign(dripAuthorityKeypair);
        await expect(
            sendAndConfirmTransaction(provider.connection, tx, [
                dripAuthorityKeypair,
            ])
        ).to.eventually.be.rejectedWith(/0x1795/);
    });

    [1, 2, 3].forEach((dripCount) => {
        it(`should drip ${dripCount} times with the full drip amount each time`, async () => {
            const dripPosition = await DripPosition.fetchNonNullable(
                provider.connection,
                dripPositionPublicKey,
                program.programId
            );
            expect(dripPosition.data.dripAmountFilled.toString()).to.equal('0');
            const depositAmount =
                BigInt(dripPosition.data.dripAmount) * BigInt(dripCount);
            await mintTo(
                provider.connection,
                mintAuthority,
                inputMintPublicKey,
                dripPositionInputTokenAccountPublicKey,
                mintAuthority,
                depositAmount
            );
            const commonAccounts = {
                dripAuthority: dripAuthorityKeypair.publicKey,
                globalConfig: globalConfigPublicKey,
                pairConfig: pairConfigPublicKey,
                dripPosition: dripPositionPublicKey,
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

            for (let i = 0; i < dripCount; i++) {
                const [
                    dripPositionBefore,
                    positionInputBalanceBefore,
                    positionOutputBalanceBefore,
                    dripperInputBalanceBefore,
                    dripperOutputBalanceBefore,
                ] = await Promise.all([
                    DripPosition.fetch(
                        provider.connection,
                        dripPositionPublicKey,
                        program.programId
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripPositionInputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripPositionOutputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripperInputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripperOutputTokenAccountPublicKey
                    ),
                ]);
                assert(dripPositionBefore);

                const dripAmountBefore = BigInt(
                    dripPositionBefore.data.dripAmount
                );
                const dripAmountFilledBefore =
                    dripPositionBefore.data.dripAmountFilled;
                expect(dripAmountFilledBefore.toString()).to.equal('0');
                const input_token_fee_amount =
                    (dripAmountBefore * BigInt(inputTokenFeeBps)) /
                    BigInt(10_000);
                const outputReceiveAmount = dripAmountBefore / BigInt(2);

                const requestedDripAmount = dripAmountBefore;
                const expectedReceiveAmount =
                    dripAmountBefore - input_token_fee_amount;
                const preDripIx = await program.methods
                    .preDrip({
                        dripAmountToFill: new BN(
                            requestedDripAmount.toString()
                        ),
                        minimumOutputTokensExpected: new BN(
                            outputReceiveAmount.toString()
                        ),
                    })
                    .accounts({
                        ...commonAccounts,
                        systemProgram: SystemProgram.programId,
                    })
                    .instruction();
                const swapIxs = [
                    createBurnInstruction(
                        dripperInputTokenAccountPublicKey,
                        inputMintPublicKey,
                        dripAuthorityKeypair.publicKey,
                        expectedReceiveAmount
                    ),
                    createMintToInstruction(
                        outputMintPublicKey,
                        dripperOutputTokenAccountPublicKey,
                        mintAuthority.publicKey,
                        outputReceiveAmount
                    ),
                ];
                const postDripIx = await program.methods
                    .postDrip()
                    .accounts({
                        ...commonAccounts,
                        inputTokenFeeAccount: inputTokenFeeAccountPublicKey,
                        outputTokenFeeAccount: outputTokenFeeAccountPublicKey,
                    })
                    .instruction();

                const tx = new Transaction({
                    feePayer: dripAuthorityKeypair.publicKey,
                    recentBlockhash: (
                        await provider.connection.getRecentBlockhash()
                    ).blockhash,
                }).add(preDripIx, ...swapIxs, postDripIx);
                tx.sign(dripAuthorityKeypair, mintAuthority);

                await sendAndConfirmTransaction(
                    provider.connection,
                    tx,
                    [dripAuthorityKeypair, mintAuthority],
                    { skipPreflight: true }
                );

                const [
                    positionInputBalanceAfter,
                    positionOutputBalanceAfter,
                    dripperInputBalanceAfter,
                    dripperOutputBalanceAfter,
                ] = await Promise.all([
                    provider.connection.getTokenAccountBalance(
                        dripPositionInputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripPositionOutputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripperInputTokenAccountPublicKey
                    ),
                    provider.connection.getTokenAccountBalance(
                        dripperOutputTokenAccountPublicKey
                    ),
                ]);

                expect(BigInt(positionInputBalanceAfter.value.amount)).to.equal(
                    BigInt(positionInputBalanceBefore.value.amount) -
                        dripAmountBefore
                );
                expect(
                    BigInt(positionOutputBalanceAfter.value.amount)
                ).to.equal(
                    BigInt(positionOutputBalanceBefore.value.amount) +
                        outputReceiveAmount
                );

                await delay(
                    Number(dripPositionBefore.data.frequencyInSeconds) + 500
                );
            }
        });
    });

    it('should drip twice in the same cycle with partial drips', async () => {
        const dripPosition = await DripPosition.fetch(
            provider.connection,
            dripPositionPublicKey,
            program.programId
        );
        assert(dripPosition);
        const dripAmountBefore = BigInt(dripPosition.data.dripAmount);
        const depositAmount = dripAmountBefore * BigInt(1);
        await mintTo(
            provider.connection,
            mintAuthority,
            inputMintPublicKey,
            dripPositionInputTokenAccountPublicKey,
            mintAuthority,
            depositAmount
        );
        const commonAccounts = {
            dripAuthority: dripAuthorityKeypair.publicKey,
            globalConfig: globalConfigPublicKey,
            pairConfig: pairConfigPublicKey,
            dripPosition: dripPositionPublicKey,
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

        const dripCount = 2;
        for (let i = 0; i < dripCount; i++) {
            const [
                dripPositionBefore,
                positionInputBalanceBefore,
                positionOutputBalanceBefore,
                dripperInputBalanceBefore,
                dripperOutputBalanceBefore,
            ] = await Promise.all([
                DripPosition.fetchNonNullable(
                    provider.connection,
                    dripPositionPublicKey,
                    program.programId
                ),
                provider.connection.getTokenAccountBalance(
                    dripPositionInputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripPositionOutputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripperInputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripperOutputTokenAccountPublicKey
                ),
            ]);
            assert(dripPositionBefore);
            const dripAmountBefore = BigInt(dripPositionBefore.data.dripAmount);
            const dripAmountFilledBefore =
                dripPositionBefore.data.dripAmountFilled;
            if (i == 0) {
                expect(dripAmountFilledBefore.toString()).equal('0');
            }

            const outputReceiveAmount = dripAmountBefore / BigInt(2);
            const expectedOutputFees = applyBps(
                outputReceiveAmount,
                BigInt(outputTokenFeeBps)
            );
            const partialDripAmountBeforeFees = BigInt(
                dripAmountBefore / BigInt(dripCount)
            );
            const expectedInputFees = applyBps(
                partialDripAmountBeforeFees,
                BigInt(inputTokenFeeBps)
            );
            const partialDripAmountAfterFees =
                BigInt(partialDripAmountBeforeFees) - BigInt(expectedInputFees);

            const preDripIx = await program.methods
                .preDrip({
                    dripAmountToFill: new BN(
                        partialDripAmountBeforeFees.toString()
                    ),
                    minimumOutputTokensExpected: new BN(
                        outputReceiveAmount.toString()
                    ),
                })
                .accounts({
                    ...commonAccounts,
                    systemProgram: SystemProgram.programId,
                })
                .instruction();

            const swapIxs = [
                createBurnInstruction(
                    dripperInputTokenAccountPublicKey,
                    inputMintPublicKey,
                    dripAuthorityKeypair.publicKey,
                    partialDripAmountAfterFees
                ),
                createMintToInstruction(
                    outputMintPublicKey,
                    dripperOutputTokenAccountPublicKey,
                    mintAuthority.publicKey,
                    outputReceiveAmount
                ),
            ];

            const postDripIx = await program.methods
                .postDrip()
                .accounts({
                    ...commonAccounts,
                    inputTokenFeeAccount: inputTokenFeeAccountPublicKey,
                    outputTokenFeeAccount: outputTokenFeeAccountPublicKey,
                })
                .instruction();

            const tx = new Transaction({
                feePayer: dripAuthorityKeypair.publicKey,
                recentBlockhash: (
                    await provider.connection.getRecentBlockhash()
                ).blockhash,
            }).add(preDripIx, ...swapIxs, postDripIx);
            tx.sign(dripAuthorityKeypair, mintAuthority);

            await sendAndConfirmTransaction(provider.connection, tx, [
                dripAuthorityKeypair,
                mintAuthority,
            ]);

            const [
                dripPositionAfter,
                positionInputBalanceAfter,
                positionOutputBalanceAfter,
                dripperInputBalanceAfter,
                dripperOutputBalanceAfter,
            ] = await Promise.all([
                DripPosition.fetch(
                    provider.connection,
                    dripPositionPublicKey,
                    program.programId
                ),
                provider.connection.getTokenAccountBalance(
                    dripPositionInputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripPositionOutputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripperInputTokenAccountPublicKey
                ),
                provider.connection.getTokenAccountBalance(
                    dripperOutputTokenAccountPublicKey
                ),
            ]);
            assert(dripPositionAfter);
            const dripPositionAfterJSON = dripPositionAfter.toJSON();
            const dripPositionBeforeJSON = dripPositionBefore.toJSON();

            expect({
                ...dripPositionAfterJSON,
                // These values are expected to change!
                // These are validated below
                dripActivationTimestamp: '0',
                dripAmountFilled: '0',
                totalInputTokenDripped: '0',
                totalOutputTokenReceived: '0',
                totalInputFeesCollected: '0',
                totalOutputFeesCollected: '0',
            }).to.deep.equal({
                ...dripPositionBeforeJSON,
                dripActivationTimestamp: '0',
                dripAmountFilled: '0',
                totalInputTokenDripped: '0',
                totalOutputTokenReceived: '0',
                totalInputFeesCollected: '0',
                totalOutputFeesCollected: '0',
            });

            if (i == 0) {
                expect(dripPositionAfterJSON.dripAmountFilled).to.equal(
                    partialDripAmountBeforeFees.toString()
                );
                expect(dripPositionAfterJSON.totalInputTokenDripped).to.equal(
                    partialDripAmountBeforeFees.toString()
                );
                expect(dripPositionAfterJSON.totalInputFeesCollected).to.equal(
                    expectedInputFees.toString()
                );
                expect(dripPositionAfterJSON.totalOutputFeesCollected).to.equal(
                    expectedOutputFees.toString()
                );
                // should not advance the cycle
                expect(dripPositionAfterJSON.dripActivationTimestamp).to.equal(
                    dripPositionBeforeJSON.dripActivationTimestamp
                );
            } else if (i == 1) {
                expect(dripPositionAfterJSON.dripAmountFilled).to.equal('0');
                expect(dripPositionAfterJSON.totalInputTokenDripped).to.equal(
                    (
                        BigInt(dripPositionBefore.data.totalInputTokenDripped) +
                        BigInt(partialDripAmountBeforeFees)
                    ).toString()
                );
                expect(dripPositionAfterJSON.totalInputFeesCollected).to.equal(
                    (
                        BigInt(
                            dripPositionBefore.data.totalInputFeesCollected
                        ) + BigInt(expectedInputFees)
                    ).toString()
                );
                expect(dripPositionAfterJSON.totalOutputFeesCollected).to.equal(
                    (
                        BigInt(
                            dripPositionBefore.data.totalOutputFeesCollected
                        ) + BigInt(expectedOutputFees)
                    ).toString()
                );
                // should advance the cycle
                expect(
                    dripPositionAfterJSON.dripActivationTimestamp
                ).to.not.equal(dripPositionBeforeJSON.dripActivationTimestamp);
            }
            if (i !== dripCount - 1) {
                await delay(Number(dripPosition.data.frequencyInSeconds) + 500);
            }
        }
    });
});
