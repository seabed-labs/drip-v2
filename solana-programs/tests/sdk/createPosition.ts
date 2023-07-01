import '../setup';
import * as anchor from '@coral-xyz/anchor';
import { DripClient, DripPDA, isTxSuccessful } from '@dcaf/drip';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { Accounts, DripV2, Instructions } from '@dcaf/drip-types';
import { AnchorProvider } from '@coral-xyz/anchor';
import { createMint } from '@solana/spl-token';
import { assert, expect } from 'chai';

describe('SDK - createPosition', () => {
    // TODO: for debugging with yarn run localnet
    // process.env.ANCHOR_PROVIDER_URL="http://localhost:8899"
    // process.env.ANCHOR_WALLET="./local.json"

    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.DripV2 as anchor.Program<DripV2>;

    it('creates a position without a pre-existing pair config and no initial deposit', async () => {
        const superAdmin = Keypair.generate();
        const mintAuthority = Keypair.generate();
        const positionOwner = Keypair.generate();
        const globalConfigKeypair = Keypair.generate();
        const provider = anchor.getProvider() as AnchorProvider;
        const dripClient = DripClient.withProvider(
            program.programId,
            globalConfigKeypair.publicKey,
            provider
        );

        const fundSuperAdminIx = SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: superAdmin.publicKey,
            lamports: 100e9,
        });

        await provider.sendAndConfirm(new Transaction().add(fundSuperAdminIx));

        const globalConfigSignerPubkey = DripPDA.deriveGlobalConfigSigner(
            globalConfigKeypair.publicKey,
            program.programId
        );

        const inputMint = await createMint(
            provider.connection,
            superAdmin,
            mintAuthority.publicKey,
            null,
            6
        );
        const outputMint = await createMint(
            provider.connection,
            superAdmin,
            mintAuthority.publicKey,
            null,
            6
        );

        const initGlobalConfigIx = new Instructions.InitGlobalConfig(
            {
                params: {
                    superAdmin: superAdmin.publicKey,
                    defaultDripFeeBps: BigInt(100),
                },
            },
            {
                payer: provider.publicKey,
                globalConfig: globalConfigKeypair.publicKey,
                globalConfigSigner: globalConfigSignerPubkey,
                systemProgram: SystemProgram.programId,
            },
            program.programId
        );

        await provider.sendAndConfirm(
            new Transaction().add(initGlobalConfigIx.build()),
            [globalConfigKeypair]
        );

        const txResult = await dripClient.createPosition({
            owner: positionOwner.publicKey,
            payer: provider.publicKey,
            inputMint,
            outputMint,
            dripAmount: BigInt(100),
            dripFrequencyInSeconds: 3600,
        });

        assert(isTxSuccessful(txResult), 'Expected TX to be successful');
        const dripPositionPubkey = txResult.value.pubkey;

        const dripPositionAccount = await Accounts.DripPosition.fetch(
            provider.connection,
            dripPositionPubkey,
            program.programId
        );

        // TODO: Exhaustive tests

        expect(dripPositionAccount?.autoCreditEnabled).to.be.false;
        // TODO: Check correctly
        expect(dripPositionAccount?.dripActivationGenesisShift.toString()).to
            .exist;
        expect(dripPositionAccount?.globalConfig.toBase58()).to.eq(
            globalConfigKeypair.publicKey.toBase58()
        );
    });
});
