import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DripV2 } from "../../target/types/drip_v2";
import { expect } from "chai";
import "../setup";

describe("Program - initGlobalConfig", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.DripV2 as Program<DripV2>;

    it("initializes the GlobalConfig account", async () => {
        const globalConfigKeypair = new Keypair();
        const superAdmin = new Keypair();
        const provider = anchor.getProvider();

        await program.methods
            .initGlobalConfig({
                version: new anchor.BN(1),
                superAdmin: superAdmin.publicKey,
                defaultDripFeeBps: new anchor.BN(100),
            })
            .accounts({
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .signers([globalConfigKeypair])
            .rpc();

        const globalConfigAccount = await program.account.globalConfig.fetch(
            globalConfigKeypair.publicKey
        );

        expect({
            version: globalConfigAccount.version.toString(),
            superAdmin: globalConfigAccount.superAdmin.toString(),
            admins: globalConfigAccount.admins.map((admin) => admin.toString()),
            adminPermissions: globalConfigAccount.adminPermissions.map(
                (admin) => admin.toString()
            ),
            defaultDripFeeBps: globalConfigAccount.defaultDripFeeBps.toString(),
        }).to.deep.equal({
            version: "1",
            superAdmin: superAdmin.publicKey.toBase58(),
            admins: Array<PublicKey>(20)
                .fill(PublicKey.default)
                .map((key) => key.toString()),
            adminPermissions: Array(20).fill("0"),
            defaultDripFeeBps: "100",
        });
    });
});
