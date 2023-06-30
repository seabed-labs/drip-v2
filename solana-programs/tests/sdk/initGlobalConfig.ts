import '../setup';
import * as anchor from '@coral-xyz/anchor';
import { Drip } from '@dcaf/drip';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { expect } from 'chai';
import { DripV2 } from '@dcaf/drip-types';
import { AnchorProvider } from '@coral-xyz/anchor';

describe('SDK - initGlobalConfig', () => {
    // TODO: for debugging with yarn run localnet
    // process.env.ANCHOR_PROVIDER_URL="http://localhost:8899"
    // process.env.ANCHOR_WALLET="./local.json"

    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.DripV2 as anchor.Program<DripV2>;

    it('initializes the GlobalConfig account', async () => {
        const superAdmin = Keypair.generate();
        const globalConfigKeypair = Keypair.generate();
        const provider = anchor.getProvider() as AnchorProvider;

        const drip = new Drip(
            program.programId,
            new Connection(
                provider.connection.rpcEndpoint,
                provider.connection.commitment
            )
        );

        const { tx } = await drip.initGlobalConfig(
            superAdmin.publicKey,
            BigInt(100),
            globalConfigKeypair,
            provider.publicKey
        );

        await provider.sendAndConfirm(tx, [globalConfigKeypair], {
            skipPreflight: true,
        });

        const globalConfigAccountDirect =
            await program.account.globalConfig.fetch(
                globalConfigKeypair.publicKey
            );

        const globalConfigAccountSdk = await drip.fetchGlobalConfig(
            globalConfigKeypair.publicKey
        );

        for (const globalConfigAccount of [
            globalConfigAccountDirect,
            globalConfigAccountSdk,
        ]) {
            expect({
                version: globalConfigAccount.version.toString(),
                superAdmin: globalConfigAccount.superAdmin.toString(),
                admins: globalConfigAccount.admins.map((admin) =>
                    admin.toString()
                ),
                adminPermissions: globalConfigAccount.adminPermissions.map(
                    (admin) => admin.toString()
                ),
                defaultDripFeeBps:
                    globalConfigAccount.defaultDripFeeBps.toString(),
            }).to.deep.equal({
                version: '0',
                superAdmin: superAdmin.publicKey.toBase58(),
                admins: Array<PublicKey>(20)
                    .fill(PublicKey.default)
                    .map((key) => key.toString()),
                adminPermissions: Array(20).fill('0'),
                defaultDripFeeBps: '100',
            });
        }
    });
});
