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
    feeCollector: PublicKey;
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
            feeCollector: account.feeCollector,
        };
    }

    public async initGlobalConfig(
        superAdmin: PublicKey,
        defaultDripFeeBps: BigInt,
        globalConfigPubkey?: PublicKey,
        payer?: PublicKey
    ): Promise<{ tx: Transaction; globalConfigPubkey: PublicKey }> {
        const globalConfigKeypair = Keypair.generate();
        const _globalConfigPubkey =
            globalConfigPubkey ?? globalConfigKeypair.publicKey;

        const [feeCollector] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("drip-v2-fee-collector"),
                _globalConfigPubkey.toBuffer(),
            ],
            this.program.programId
        );

        let txBuilder = this.program.methods
            .initGlobalConfig({
                superAdmin: superAdmin,
                defaultDripFeeBps: new anchor.BN(defaultDripFeeBps.toString()),
            })
            .accounts({
                payer: payer ?? this.program.provider.publicKey,
                globalConfig: _globalConfigPubkey,
                systemProgram: SystemProgram.programId,
                feeCollector,
            });

        if (!globalConfigPubkey) {
            txBuilder = txBuilder.signers([globalConfigKeypair]);
        }

        return {
            tx: await txBuilder.transaction(),
            globalConfigPubkey: _globalConfigPubkey,
        };
    }
}
