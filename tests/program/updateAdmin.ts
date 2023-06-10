import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DripV2 } from "../../target/types/drip_v2";
import { expect } from "chai";
import "../setup";

// TODO: These tests are not exhaustive at all yet

describe("Program - updateAdmin", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.DripV2 as Program<DripV2>;

    let globalConfigPubkey: PublicKey;
    let superAdminKeypair: Keypair;

    beforeEach(async () => {
        const globalConfigKeypair = new Keypair();
        superAdminKeypair = new Keypair();

        await program.methods
            .initGlobalConfig({
                version: new anchor.BN(1),
                superAdmin: superAdminKeypair.publicKey,
                defaultDripFeeBps: new anchor.BN(100),
            })
            .accounts({
                payer: program.provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();

        globalConfigPubkey = globalConfigKeypair.publicKey;
    });

    it("doesn't allow non-super admin to update admins", async () => {
        await expect(
            program.methods
                .updateAdmin({
                    adminIndex: new anchor.BN(0),
                    adminChange: {
                        setAdminAndResetPermissions: { 0: PublicKey.default },
                    },
                })
                .accounts({
                    signer: superAdminKeypair.publicKey,
                    globalConfig: globalConfigPubkey,
                })
                .signers([superAdminKeypair])
                .rpc()
        ).to.eventually.be.rejectedWith(/AdminPubkeyCannotBeDefault.*6002/);
    });

    it("can add a new admin", async () => {
        const newAdminPubkey = PublicKey.unique();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (admin) => admin.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });

        await program.methods
            .updateAdmin({
                adminIndex: new anchor.BN(0),
                adminChange: {
                    setAdminAndResetPermissions: {
                        0: newAdminPubkey,
                    },
                },
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
                (perm) => perm.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountAfter.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [newAdminPubkey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });
    });

    it("can give init_pair_config permissions to an admin", async () => {
        const newAdminPubkey = PublicKey.unique();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountBefore.version.toString(),
            superAdmin: globalConfigAccountBefore.superAdmin.toString(),
            admins: globalConfigAccountBefore.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountBefore.adminPermissions.map(
                (admin) => admin.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountBefore.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });

        let tx = await program.methods
            .updateAdmin({
                adminIndex: new anchor.BN(0),
                adminChange: {
                    setAdminAndResetPermissions: { 0: newAdminPubkey },
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .transaction();

        const giveAdminInitPairConfigPermissionIX = await program.methods
            .updateAdmin({
                adminIndex: new anchor.BN(0),
                adminChange: {
                    addPermission: { 0: { initPairConfig: {} } },
                },
            })
            .accounts({
                signer: superAdminKeypair.publicKey,
                globalConfig: globalConfigPubkey,
            })
            .instruction();

        tx = tx.add(giveAdminInitPairConfigPermissionIX);
        tx.recentBlockhash = (
            await program.provider.connection.getLatestBlockhash()
        ).blockhash;
        tx.feePayer = anchor.getProvider().publicKey;
        tx.partialSign(superAdminKeypair);

        await anchor.getProvider().sendAndConfirm(tx);

        const globalConfigAccountAfter =
            await program.account.globalConfig.fetch(globalConfigPubkey);

        expect({
            version: globalConfigAccountAfter.version.toString(),
            superAdmin: globalConfigAccountAfter.superAdmin.toString(),
            admins: globalConfigAccountAfter.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountAfter.adminPermissions.map(
                (perm) => perm.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountAfter.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdminKeypair.publicKey.toBase58(),
            admins: [newAdminPubkey.toBase58()].concat(
                Array<PublicKey>(19)
                    .fill(PublicKey.default)
                    .map((key) => key.toString())
            ),
            adminPermissions: ["1"].concat(Array(19).fill("0")),
            defaultDripFeeBps: "100",
        });
    });
});
