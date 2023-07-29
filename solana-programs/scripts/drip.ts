import {
    BN,
    Program,
    getProvider,
    translateAddress,
    workspace,
} from '@coral-xyz/anchor';
import { DripV2, PostDripAccounts, PreDripAccounts } from '@dcaf/drip-types';
import {
    createAssociatedTokenAccountIdempotent,
    createMintToInstruction,
    getOrCreateAssociatedTokenAccount,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_INSTRUCTIONS_PUBKEY,
    Transaction,
} from '@solana/web3.js';

export async function drip(positionAddr: string): Promise<string> {
    const program = workspace.DripV2 as Program<DripV2>;
    const provider = getProvider();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const providerPubkey = provider.publicKey!;

    const payerKeypair = new Keypair();
    const fundSuperAdminIx = SystemProgram.transfer({
        fromPubkey: providerPubkey,
        toPubkey: payerKeypair.publicKey,
        lamports: 100e9, // 100 SOL
    });

    await provider.sendAndConfirm?.(new Transaction().add(fundSuperAdminIx));

    const positionPubkey = translateAddress(positionAddr);

    const positionAccount = await program.account.dripPosition.fetch(
        positionPubkey
    );

    const globalConfigAccount = await program.account.globalConfig.fetch(
        positionAccount.globalConfig
    );

    console.log('Creating input token fee account');
    const inputTokenFeeAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payerKeypair,
        positionAccount.inputTokenMint,
        globalConfigAccount.globalConfigSigner,
        true
    );

    console.log('Creating output token fee account');
    const outputTokenFeeAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payerKeypair,
        positionAccount.outputTokenMint,
        globalConfigAccount.globalConfigSigner,
        true
    );

    console.log('Creating dripper input token account');
    const dripperInputTokenAccountPubkey =
        await createAssociatedTokenAccountIdempotent(
            provider.connection,
            payerKeypair,
            positionAccount.inputTokenMint,
            providerPubkey
        );

    const dripperOutputTokenAccountPubkey =
        await createAssociatedTokenAccountIdempotent(
            provider.connection,
            payerKeypair,
            positionAccount.outputTokenMint,
            providerPubkey
        );

    console.log('Creating pre-drip IX');
    const preDripAccounts: PreDripAccounts = {
        dripAuthority: providerPubkey,
        globalConfig: positionAccount.globalConfig,
        pairConfig: positionAccount.pairConfig,
        dripPosition: positionPubkey,
        dripPositionSigner: positionAccount.dripPositionSigner,
        dripPositionInputTokenAccount: positionAccount.inputTokenAccount,
        dripPositionOutputTokenAccount: positionAccount.outputTokenAccount,
        dripperInputTokenAccount: dripperInputTokenAccountPubkey,
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        ephemeralDripState: new PublicKey('TODO'),
        dripperOutputTokenAccount: dripperOutputTokenAccountPubkey,
        systemProgram: SystemProgram.programId,
    };
    const preDripIx = await program.methods
        .preDrip({
            dripAmountToFill: new BN(100),
            minimumOutputTokensExpected: new BN(50),
        })
        .accounts(preDripAccounts)
        .instruction();

    console.log('Creating mint to IX');
    const mintOutputTokenIx = createMintToInstruction(
        positionAccount.outputTokenMint,
        positionAccount.outputTokenAccount,
        providerPubkey,
        50
    );

    console.log('Creating post-drip IX');
    const postDripAccounts: PostDripAccounts = {
        dripAuthority: providerPubkey,
        globalConfig: positionAccount.globalConfig,
        outputTokenFeeAccount: outputTokenFeeAccount.address,
        pairConfig: positionAccount.pairConfig,
        dripPosition: positionPubkey,
        dripPositionSigner: positionAccount.dripPositionSigner,
        dripPositionInputTokenAccount: positionAccount.inputTokenAccount,
        dripPositionOutputTokenAccount: positionAccount.outputTokenAccount,
        dripperInputTokenAccount: dripperInputTokenAccountPubkey,
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        ephemeralDripState: new PublicKey('TODO'),
        dripperOutputTokenAccount: dripperOutputTokenAccountPubkey,
        inputTokenFeeAccount: inputTokenFeeAccount.address,
    };
    const postDripIx = await program.methods
        .postDrip()
        .accounts(postDripAccounts)
        .instruction();

    console.log('Dripping...');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const dripTxSig = await provider.sendAndConfirm!(
        new Transaction().add(preDripIx, mintOutputTokenIx, postDripIx)
    );

    return dripTxSig;
}

if (require.main === module) {
    if (process.argv.length !== 3) {
        console.error('Error: Incorrect invocation');
        console.error('Usage: yarn drip <position pubkey>');
        process.exit(1);
    }

    drip(process.argv[2])
        .then((dripTxSig) =>
            console.log(
                'Drip Successful ',
                JSON.stringify(
                    {
                        dripTx: dripTxSig,
                    },
                    null,
                    2
                )
            )
        )
        .catch((err) => console.error('Drip Failed:', err));
}
