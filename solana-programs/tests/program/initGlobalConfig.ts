import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { DripV2 } from "@dcaf/drip-types";
import { expect } from "chai";
import "../setup";

describe("Program - initGlobalConfig", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.DripV2 as Program<DripV2>;

  it("initializes the GlobalConfig account", async () => {
    const globalConfigKeypair = new Keypair();
    const superAdmin = new Keypair();
    const provider = anchor.getProvider();

    const [globalSignerPubkey] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("drip-v2-global-signer"),
        globalConfigKeypair.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .initGlobalConfig({
        superAdmin: superAdmin.publicKey,
        defaultDripFeeBps: new anchor.BN(100),
      })
      .accounts({
        payer: provider.publicKey,
        globalConfig: globalConfigKeypair.publicKey,
        systemProgram: SystemProgram.programId,
        globalConfigSigner: globalSignerPubkey,
      })
      .signers([globalConfigKeypair])
      .rpc();

    const globalConfigAccount = await program.account.globalConfig.fetch(
      globalConfigKeypair.publicKey
    );

    const feeCollectorAccount = await program.account.globalConfigSigner.fetch(
      globalSignerPubkey
    );

    expect({
      version: globalConfigAccount.version.toString(),
      superAdmin: globalConfigAccount.superAdmin.toString(),
      admins: globalConfigAccount.admins.map((admin) => admin.toString()),
      adminPermissions: globalConfigAccount.adminPermissions.map((admin) =>
        admin.toString()
      ),
      defaultDripFeeBps: globalConfigAccount.defaultDripFeeBps.toString(),
      globalConfigSigner: globalConfigAccount.globalConfigSigner.toString(),
    }).to.deep.equal({
      version: "0",
      superAdmin: superAdmin.publicKey.toBase58(),
      admins: Array<PublicKey>(20)
        .fill(PublicKey.default)
        .map((key) => key.toString()),
      adminPermissions: Array(20).fill("0"),
      defaultDripFeeBps: "100",
      globalConfigSigner: globalSignerPubkey.toBase58(),
    });

    expect({
      globalConfig: feeCollectorAccount.globalConfig.toString(),
    }).to.deep.equal({
      globalConfig: globalConfigKeypair.publicKey.toBase58(),
    });
  });
});
