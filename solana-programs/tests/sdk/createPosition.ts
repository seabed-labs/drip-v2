import '../setup';
import * as anchor from '@coral-xyz/anchor';
import { DripClient, DripPDA, IDripClient, isTxSuccessful } from '@dcaf/drip';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
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
    const provider = anchor.getProvider() as AnchorProvider;

    let mintAuthorityKeypair: Keypair;
    let inputMintPubkey: PublicKey, outputMintPubkey: PublicKey;

    let superAdminKeypair: Keypair;
    let globalConfigPubkey: PublicKey;
    let dripClient: IDripClient;

    before(async () => {
        mintAuthorityKeypair = Keypair.generate();
        const fundMintAuthorityIx = SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: mintAuthorityKeypair.publicKey,
            lamports: 100e9,
        });

        await provider.sendAndConfirm(
            new Transaction(await provider.connection.getLatestBlockhash()).add(
                fundMintAuthorityIx
            )
        );

        inputMintPubkey = await createMint(
            provider.connection,
            mintAuthorityKeypair,
            mintAuthorityKeypair.publicKey,
            null,
            6
        );

        outputMintPubkey = await createMint(
            provider.connection,
            mintAuthorityKeypair,
            mintAuthorityKeypair.publicKey,
            null,
            6
        );

        superAdminKeypair = Keypair.generate();
        const globalConfigKeypair = Keypair.generate();

        globalConfigPubkey = globalConfigKeypair.publicKey;
        const globalConfigSignerPubkey = DripPDA.deriveGlobalConfigSigner(
            globalConfigKeypair.publicKey,
            program.programId
        );

        const initGlobalConfigIx = new Instructions.InitGlobalConfig(
            {
                params: {
                    superAdmin: superAdminKeypair.publicKey,
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
            new Transaction(await provider.connection.getLatestBlockhash()).add(
                initGlobalConfigIx.build()
            ),
            [globalConfigKeypair],
            { maxRetries: 3 }
        );

        dripClient = DripClient.withProvider(
            program.programId,
            globalConfigKeypair.publicKey,
            provider
        );
    });

    it.only('creates a position without a pre-existing pair config and no initial deposit', async () => {
        const positionOwner = Keypair.generate();

        const txResult = await dripClient.createPosition({
            owner: positionOwner.publicKey,
            payer: provider.publicKey,
            inputMint: inputMintPubkey,
            outputMint: outputMintPubkey,
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
            globalConfigPubkey.toBase58()
        );
    });
});
