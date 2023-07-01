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
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createMint,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';
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
            new Transaction(
                // TODO: If this reduces flakiness, propagate it everywhere (by "it", I mean using the finalized latest blockhash)
                //       SDK does not use this at the moment
                await provider.connection.getLatestBlockhash('finalized')
            ).add(fundMintAuthorityIx)
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

    it('creates a position without a pre-existing pair config and no initial deposit', async () => {
        const positionOwner = Keypair.generate();

        const txResult = await dripClient.createPosition({
            owner: positionOwner.publicKey,
            payer: provider.publicKey,
            inputMint: inputMintPubkey,
            outputMint: outputMintPubkey,
            dripAmount: BigInt(1000),
            dripFrequencyInSeconds: 3600,
        });

        assert(isTxSuccessful(txResult), 'Expected TX to be successful');
        const dripPositionPubkey = txResult.value.pubkey;

        const dripPositionAccount = await Accounts.DripPosition.fetch(
            provider.connection,
            dripPositionPubkey,
            program.programId
        );

        const expectedDripPositionSignerPubkey =
            PublicKey.findProgramAddressSync(
                [
                    Buffer.from('drip-v2-drip-position-signer'),
                    dripPositionPubkey.toBuffer(),
                ],
                program.programId
            )[0];

        const expectedDripPositionInputTokenAccount =
            getAssociatedTokenAddressSync(
                inputMintPubkey,
                expectedDripPositionSignerPubkey,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

        const expectedDripPositionOutputTokenAccount =
            getAssociatedTokenAddressSync(
                outputMintPubkey,
                expectedDripPositionSignerPubkey,
                true,
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

        expect(dripPositionAccount?.toJSON()).to.exist;
        expect(Object.keys(dripPositionAccount?.toJSON() ?? {}).length).to.eq(
            // NOTE: If you update this, also update the actual field check below
            20
        );
        expect(dripPositionAccount?.toJSON()).to.deep.include({
            globalConfig: globalConfigPubkey.toBase58(),
            owner: {
                kind: 'Direct',
                value: {
                    owner: positionOwner.publicKey.toBase58(),
                },
            },
            dripFeeBps: '100',
            dripPositionSigner: expectedDripPositionSignerPubkey.toBase58(),
            autoCreditEnabled: false,
            pairConfig: PublicKey.findProgramAddressSync(
                [
                    Buffer.from('drip-v2-pair-config'),
                    globalConfigPubkey.toBuffer(),
                    inputMintPubkey.toBuffer(),
                    outputMintPubkey.toBuffer(),
                ],
                program.programId
            )[0].toBase58(),
            inputTokenMint: inputMintPubkey.toBase58(),
            outputTokenMint: outputMintPubkey.toBase58(),
            inputTokenAccount: expectedDripPositionInputTokenAccount.toBase58(),
            outputTokenAccount:
                expectedDripPositionOutputTokenAccount.toBase58(),
            dripAmount: '1000',
            dripAmountFilled: '0',
            frequencyInSeconds: '3600',
            totalInputTokenDripped: '0',
            totalOutputTokenReceived: '0',
            dripPositionNftMint: null,
            dripMaxJitter: 0,
            // TODO: Not sure how to check correctly (we need to fake the time somehow)
            //       For now we should just unit test this instead
            // dripActivationGenesisShift: '0',
            // dripActivationTimestamp: '0',
            ephemeralDripState: null,
        });

        expect(
            Number(dripPositionAccount?.dripActivationGenesisShift)
        ).greaterThanOrEqual(0);

        expect(
            Number(dripPositionAccount?.dripActivationGenesisShift)
        ).lessThan(3600);

        expect(
            Number(dripPositionAccount?.dripActivationTimestamp)
        ).greaterThan(0);
    });
});
