import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { DripV2, IDL } from "./idl/drip_v2";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";

export interface GlobalConfigAccount {
    version: bigint;
    superAdmin: PublicKey;
    admins: PublicKey[];
    adminPermissions: BigInt[];
    defaultDripFeeBps: bigint;
}

export class Drip {
    private readonly program;

    public constructor(
        public readonly programId: PublicKey,
        public readonly providerOrConnection: AnchorProvider | Connection
    ) {
        const provider =
            providerOrConnection instanceof AnchorProvider
                ? providerOrConnection
                : new anchor.AnchorProvider(
                      providerOrConnection,
                      new NodeWallet(Keypair.generate()),
                      { commitment: providerOrConnection.commitment }
                  );

        this.program = new anchor.Program<DripV2>(
            IDL,
            this.programId,
            provider
        );
    }

    public async fetchGlobalConfig(
        key: PublicKey
    ): Promise<GlobalConfigAccount> {
        const account = await this.program.account.globalConfig.fetch(key);

        return {
            version: BigInt(account.version.toString()),
            superAdmin: account.superAdmin,
            admins: account.admins,
            adminPermissions: account.adminPermissions.map((permission) =>
                BigInt(permission.toString())
            ),
            defaultDripFeeBps: BigInt(account.defaultDripFeeBps.toString()),
        };
    }

    public async initGlobalConfig(
        version: number,
        superAdmin: PublicKey,
        defaultDripFeeBps: BigInt,
        globalConfigPubkey?: PublicKey,
        payer?: PublicKey
    ): Promise<{ tx: Transaction; globalConfigPubkey: PublicKey }> {
        const globalConfigKeypair = Keypair.generate();

        let txBuilder = this.program.methods
            .initGlobalConfig({
                version: new anchor.BN(version.toString()),
                superAdmin: superAdmin,
                defaultDripFeeBps: new anchor.BN(defaultDripFeeBps.toString()),
            })
            .accounts({
                payer: payer ?? this.program.provider.publicKey,
                globalConfig:
                    globalConfigPubkey ?? globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
            });

        if (!globalConfigPubkey) {
            txBuilder = txBuilder.signers([globalConfigKeypair]);
        }

        return {
            tx: await txBuilder.transaction(),
            globalConfigPubkey:
                globalConfigPubkey ?? globalConfigKeypair.publicKey,
        };
    }
}