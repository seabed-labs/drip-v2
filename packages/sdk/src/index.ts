import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js'
import { DripV2, IDL } from '@dcaf/drip-types'
import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import { Accounts } from '@dcaf/drip-types'

export class Drip {
    private readonly program: Program<DripV2>

    public constructor(
        public readonly programId: PublicKey,
        public readonly connection: Connection,
        provider?: AnchorProvider
    ) {
        this.program = new Program<DripV2>(IDL, this.programId, provider)
    }

    public async fetchGlobalConfig(
        key: PublicKey
    ): Promise<Accounts.GlobalConfig> {
        const globalConfig = await Accounts.GlobalConfig.fetch(
            this.connection,
            key,
            this.programId
        )
        if (!globalConfig) {
            throw new Error(`Global config ${key.toString()} not found`)
        }
        return globalConfig
    }

    public async initGlobalConfig(
        superAdmin: PublicKey,
        defaultDripFeeBps: bigint,
        globalConfigKeypair: Keypair = Keypair.generate(),
        payer?: PublicKey
    ): Promise<{ tx: Transaction; globalConfigKeypair: Keypair }> {
        const [globalConfigSigner] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-global-signer'),
                globalConfigKeypair.publicKey.toBuffer(),
            ],
            this.program.programId
        )
        const txBuilder = this.program.methods
            .initGlobalConfig({
                superAdmin: superAdmin,
                defaultDripFeeBps: new BN(defaultDripFeeBps.toString()),
            })
            .accounts({
                payer: payer ?? this.program.provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                systemProgram: SystemProgram.programId,
                globalConfigSigner,
            })
            .signers([globalConfigKeypair])
        return {
            tx: await txBuilder.transaction(),
            globalConfigKeypair,
        }
    }
}
