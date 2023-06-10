import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DripV2 } from "../../target/types/drip_v2";
import { expect } from "chai";
import "../setup";

describe("Program - updateSuperAdmin", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.DripV2 as Program<DripV2>;

    it("updates the super admin", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const superAdmin2 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
                version: new anchor.BN(1),
                superAdmin: superAdmin1.publicKey,
                defaultDripFeeBps: new anchor.BN(100),
            })
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();

        const globalConfigAccountBefore =
            await program.account.globalConfig.fetch(
                globalConfigKeypair.publicKey
            );

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
            superAdmin: superAdmin1.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });

        await program.methods
            .updateSuperAdmin({
                newSuperAdmin: superAdmin2.publicKey,
            })
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
            })
            .signers([superAdmin1])
            .rpc();

        const globalConfigAccountAfter =
            await program.account.globalConfig.fetch(
                globalConfigKeypair.publicKey
            );

        expect({
            version: globalConfigAccountAfter.version.toString(),
            superAdmin: globalConfigAccountAfter.superAdmin.toString(),
            admins: globalConfigAccountAfter.admins.map((admin) =>
                admin.toString()
            ),
            adminPermissions: globalConfigAccountAfter.adminPermissions.map(
                (admin) => admin.toString()
            ),
            defaultDripFeeBps:
                globalConfigAccountAfter.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdmin2.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });
    });

    it("errors out if super admin doesn't sign", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const superAdmin2 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
                version: new anchor.BN(1),
                superAdmin: superAdmin1.publicKey,
                defaultDripFeeBps: new anchor.BN(100),
            })
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();

        const asyncTx = program.methods
            .updateSuperAdmin({
                newSuperAdmin: superAdmin2.publicKey,
            })
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
            })
            .rpc();

        await expect(asyncTx).to.eventually.be.rejectedWith(
            /Signature verification failed/
        );
    });

    it("doesn't allow default pubkey", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
                version: new anchor.BN(1),
                superAdmin: superAdmin1.publicKey,
                defaultDripFeeBps: new anchor.BN(100),
            })
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();

        const asyncTx = program.methods
            .updateSuperAdmin({
                newSuperAdmin: PublicKey.default,
            })
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
            })
            .signers([superAdmin1])
            .rpc();

        await expect(asyncTx).to.eventually.be.rejectedWith(
            /AdminPubkeyCannotBeDefault.*6002/
        );
    });
});
