import {
    AnchorProvider,
    BN,
    Program,
    setProvider,
    workspace,
} from '@coral-xyz/anchor';
import { DripV2 } from '@dcaf/drip-types';
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';
import '../setup';

describe('Program - updateDefaultDripFees', () => {
    setProvider(AnchorProvider.env());
    const program = workspace.DripV2 as Program<DripV2>;

    let superAdminKeypair: Keypair;
    let globalConfigPubkey: PublicKey;

    beforeEach(async () => {
        superAdminKeypair = Keypair.generate();
        const globalConfigKeypair = Keypair.generate();
        globalConfigPubkey = globalConfigKeypair.publicKey;

        await program.methods
            .initGlobalConfig({
                superAdmin: superAdminKeypair.publicKey,
                defaultDripFeeBps: new BN(100),
            })
            .accounts({
                payer: program.provider.publicKey,
                globalConfig: globalConfigPubkey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();
    });

    it('updates the default drip fees as super admin', async () => {
        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill('0'),
            defaultDripFeeBps: '100',
        });

        await program.methods
            .updateDefaultDripFees({
                newDefaultDripFeesBps: new BN(50),
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .signers([superAdminKeypair])
            .rpc();

        const globalConfigAccountAfter =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountAfter.version.toString(),
            superAdmin: globalConfigAccountAfter.superAdmin.toString(),
            admins: globalConfigAccountAfter.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountAfter.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountAfter.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill('0'),
            defaultDripFeeBps: '50',
        });
    });

    it('updates the default drip fees as admin with appropriate permissions', async () => {
        const adminKeypair = Keypair.generate();

        await program.methods
            .updateAdmin({
                adminIndex: new BN(0),
                adminChange: {
                    setAdminAndResetPermissions: {
                        0: adminKeypair.publicKey,
                    },
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .postInstructions([
                await program.methods
                    .updateAdmin({
                        adminIndex: new BN(0),
                        adminChange: {
                            addPermission: {
                                0: {
                                    updateDefaultDripFees: {},
                                },
                            },
                        },
                    })
                    .accounts({
                        signer: superAdminKeypair.publicKey,
                        globalConfig: globalConfigPubkey,
                    })
                    .instruction(),
            ])
            .signers([superAdminKeypair])
            .rpc();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [adminKeypair.publicKey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: ['2'].concat(Array(19).fill('0')),
            defaultDripFeeBps: '100',
        });

        await program.methods
            .updateDefaultDripFees({
                newDefaultDripFeesBps: new BN(50),
            })
            .accounts({
                signer: adminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .signers([adminKeypair])
            .rpc();

        const globalConfigAccountAfter =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountAfter.version.toString(),
            superAdmin: globalConfigAccountAfter.superAdmin.toString(),
            admins: globalConfigAccountAfter.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountAfter.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountAfter.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [adminKeypair.publicKey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: ['2'].concat(Array(19).fill('0')),
            defaultDripFeeBps: '50',
        });
    });

    it('does not update the default drip fees as admin without appropriate permissions', async () => {
        const adminKeypair = Keypair.generate();

        await program.methods
            .updateAdmin({
                adminIndex: new BN(0),
                adminChange: {
                    setAdminAndResetPermissions: {
                        0: adminKeypair.publicKey,
                    },
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .postInstructions([
                await program.methods
                    .updateAdmin({
                        adminIndex: new BN(0),
                        adminChange: {
                            addPermission: {
                                0: {
                                    drip: {},
                                },
                            },
                        },
                    })
                    .accounts({
                        signer: superAdminKeypair.publicKey,
                        globalConfig: globalConfigPubkey,
                    })
                    .instruction(),
            ])
            .signers([superAdminKeypair])
            .rpc();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [adminKeypair.publicKey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: ['1'].concat(Array(19).fill('0')),
            defaultDripFeeBps: '100',
        });

        await expect(
            program.methods
                .updateDefaultDripFees({
                    newDefaultDripFeesBps: new BN(50),
                })
                .accounts({
                    signer: adminKeypair.publicKey,
                    globalConfig: globalConfigPubkey,
                })
                .signers([adminKeypair])
                .rpc()
        ).to.eventually.be.rejectedWith(/OperationUnauthorized.*6004/);
    });

    it('does not update the default drip fees as non-admin and non-super admin', async () => {
        const adminKeypair = Keypair.generate();
        const nonAdminKeypair = Keypair.generate();

        await program.methods
            .updateAdmin({
                adminIndex: new BN(0),
                adminChange: {
                    setAdminAndResetPermissions: {
                        0: adminKeypair.publicKey,
                    },
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .postInstructions([
                await program.methods
                    .updateAdmin({
                        adminIndex: new BN(0),
                        adminChange: {
                            addPermission: {
                                0: {
                                    drip: {},
                                },
                            },
                        },
                    })
                    .accounts({
                        signer: superAdminKeypair.publicKey,
                        globalConfig: globalConfigPubkey,
                    })
                    .instruction(),
            ])
            .signers([superAdminKeypair])
            .rpc();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (p) => p.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: '0',
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [adminKeypair.publicKey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: ['1'].concat(Array(19).fill('0')),
            defaultDripFeeBps: '100',
        });

        await expect(
            program.methods
                .updateDefaultDripFees({
                    newDefaultDripFeesBps: new BN(50),
                })
                .accounts({
                    signer: nonAdminKeypair.publicKey,
                    globalConfig: globalConfigPubkey,
                })
                .signers([nonAdminKeypair])
                .rpc()
        ).to.eventually.be.rejectedWith(/OperationUnauthorized.*6004/);
    });
});
