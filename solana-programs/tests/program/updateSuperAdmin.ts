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
            version: "0",
            superAdmin: superAdmin1.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });

        await program.methods
            .updateSuperAdmin()
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                newSuperAdmin: superAdmin2.publicKey,
            })
            .signers([superAdmin1, superAdmin2])
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
            version: "0",
            superAdmin: superAdmin2.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });
    });

    it("errors out if neither old nor new super admins sign", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const superAdmin2 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
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

        const asyncTx3 = program.methods
            .updateSuperAdmin()
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                newSuperAdmin: superAdmin2.publicKey,
            })
            .rpc();

        await expect(asyncTx3).to.eventually.be.rejectedWith(
            /Signature verification failed/
        );
    });

    it("errors out if only old super admin signs", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const superAdmin2 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
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

        const asyncTx3 = program.methods
            .updateSuperAdmin()
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                newSuperAdmin: superAdmin2.publicKey,
            })
            .signers([superAdmin1])
            .rpc();

        await expect(asyncTx3).to.eventually.be.rejectedWith(
            /Signature verification failed/
        );
    });

    it("errors out if only new super admin signs", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin1 = Keypair.generate();
        const superAdmin2 = Keypair.generate();
        const provider = program.provider;

        await program.methods
            .initGlobalConfig({
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

        const asyncTx3 = program.methods
            .updateSuperAdmin()
            .accounts({
                signer: superAdmin1.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                newSuperAdmin: superAdmin2.publicKey,
            })
            .signers([superAdmin2])
            .rpc();

        await expect(asyncTx3).to.eventually.be.rejectedWith(
            /Signature verification failed/
        );
    });
});
