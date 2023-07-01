import dotenv from 'dotenv';
dotenv.config({
    path: './scripts/staging.env',
});

import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';
import { DripV2, IDL } from '@dcaf/drip-types';
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    TransactionInstruction,
} from '@solana/web3.js';
import fs from 'fs/promises';
import { Accounts } from '@dcaf/drip-types';
import * as anchor from '@coral-xyz/anchor';
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function keyPairToObject(key: Keypair) {
    return {
        pub: key.publicKey.toString(),
        priv: key.secretKey.toString(),
    };
}

export function stringifyJSON(obj: object): string {
    return JSON.stringify(obj, null, 2);
}

async function maybeInitPairConfig(
    provider: AnchorProvider,
    program: Program<DripV2>,
    globalConfig: PublicKey,
    inputTokenMint: PublicKey,
    outputTokenMint: PublicKey
): Promise<{
    address: PublicKey;
    instruction?: TransactionInstruction;
}> {
    let ix: TransactionInstruction | undefined = undefined;
    const [pairConfigPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-pair-config'),
            globalConfig.toBuffer(),
            inputTokenMint.toBuffer(),
            outputTokenMint.toBuffer(),
        ],
        program.programId
    );
    const pairConfigAccount = await Accounts.PairConfig.fetch(
        provider.connection,
        pairConfigPubkey,
        program.programId
    );
    if (!pairConfigAccount) {
        ix = await program.methods
            .initPairConfig()
            .accounts({
                payer: provider.publicKey,
                globalConfig,
                inputTokenMint,
                outputTokenMint,
                pairConfig: pairConfigPubkey,
                systemProgram: SystemProgram.programId,
            })
            .instruction();
    }
    return {
        address: pairConfigPubkey,
        instruction: ix,
    };
}

async function maybeInitAta(
    provider: AnchorProvider,
    mint: PublicKey,
    owner: PublicKey
): Promise<{
    address: PublicKey;
    instruction?: TransactionInstruction;
}> {
    const ata = await getAssociatedTokenAddress(mint, owner);
    let ix: TransactionInstruction | undefined = undefined;
    if ((await provider.connection.getAccountInfo(ata)) === null) {
        ix = createAssociatedTokenAccountInstruction(
            provider.publicKey,
            ata,
            owner,
            mint
        );
    }
    return {
        address: ata,
        instruction: ix,
    };
}

export async function createPosition(
    provider: AnchorProvider,
    program: Program<DripV2>,
    globalConfig: PublicKey,
    inputTokenMint: PublicKey,
    outputTokenMint: PublicKey,
    positionOwner: Keypair
): Promise<void> {
    const { address: pairConfig, instruction: initPairConfigIx } =
        await maybeInitPairConfig(
            provider,
            program,
            globalConfig,
            inputTokenMint,
            outputTokenMint
        );
    const { address: ownerInputTa, instruction: initOwnerInputTa } =
        await maybeInitAta(provider, inputTokenMint, positionOwner.publicKey);
    const { address: ownerOutputTa, instruction: initOwnerOutputTa } =
        await maybeInitAta(provider, outputTokenMint, positionOwner.publicKey);
    const preInstructions: TransactionInstruction[] = [];
    if (initPairConfigIx) {
        preInstructions.push(initPairConfigIx);
    }
    if (initOwnerInputTa) {
        preInstructions.push(initOwnerInputTa);
    }
    if (initOwnerOutputTa) {
        preInstructions.push(initOwnerOutputTa);
    }
    const dripPositionKeypair = new Keypair();

    const [dripPositionSigner] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-drip-position-signer'),
            dripPositionKeypair.publicKey.toBuffer(),
        ],
        program.programId
    );

    const initDripPositionTxSig = await program.methods
        .initDripPosition({
            dripAmount: new anchor.BN(100),
            frequencyInSeconds: new anchor.BN(3600),
        })
        .accounts({
            payer: provider.publicKey,
            owner: positionOwner.publicKey,
            globalConfig,
            pairConfig,
            inputTokenMint,
            outputTokenMint,
            inputTokenAccount: associatedAddress({
                mint: inputTokenMint,
                owner: dripPositionSigner,
            }),
            outputTokenAccount: associatedAddress({
                mint: outputTokenMint,
                owner: dripPositionSigner,
            }),
            dripPosition: dripPositionKeypair.publicKey,
            dripPositionSigner,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([positionOwner, dripPositionKeypair])
        .preInstructions(preInstructions)
        .rpc();
    console.log("initDripPositionTxSig", initDripPositionTxSig);
}

export async function setupGlobalConfig(
    provider: AnchorProvider,
    program: Program<DripV2>
): Promise<void> {
    const providerPubkey = provider.publicKey;

    const superAdmin = new Keypair();
    const globalConfigKeypair = new Keypair();
    console.log('superAdmin \n', superAdmin.secretKey.toString());
    console.log(
        'global config keypair \n',
        globalConfigKeypair.secretKey.toString()
    );
    await fs.writeFile(
        'mocks/staging_keys.json',
        stringifyJSON({
            superAdmin: keyPairToObject(superAdmin),
            globalConfigKeypair: keyPairToObject(globalConfigKeypair),
        })
    );

    const [globalSignerPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-global-signer'),
            globalConfigKeypair.publicKey.toBuffer(),
        ],
        program.programId
    );

    const initGlobalConfigTxSig = await program.methods
        .initGlobalConfig({
            superAdmin: superAdmin.publicKey,
            defaultDripFeeBps: new BN(100),
        })
        .accounts({
            payer: provider.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            globalConfigSigner: globalSignerPubkey,
        })
        .signers([globalConfigKeypair])
        .rpc();
    console.log('initGlobalConfigTxSig', initGlobalConfigTxSig);

    const addProviderAsAdminTxSig = await program.methods
        .updateAdmin({
            adminIndex: new BN(0),
            adminChange: {
                setAdminAndResetPermissions: [providerPubkey],
            },
        })
        .accounts({
            signer: superAdmin.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
        })
        .signers([superAdmin])
        .rpc();
    console.log('addProviderAsAdminTxSig', addProviderAsAdminTxSig);

    const setProviderPermToDripperTxSig = await program.methods
        .updateAdmin({
            adminIndex: new BN(0),
            adminChange: {
                addPermission: [{ drip: {} }],
            },
        })
        .accounts({
            signer: superAdmin.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
        })
        .signers([superAdmin])
        .rpc();
    console.log('setProviderPermToDripperTxSig', setProviderPermToDripperTxSig);
}

async function run() {
    const [, , cmd, ...cmdArgs] = process.argv;
    const dripperKeypair = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.DRIPPER_KEY_PAIR!))
    );
    const connection = new Connection(process.env.RPC_URL!);
    const programId = new PublicKey(process.env.DRIP_PROGRAM_ID!);
    const wallet = new Wallet(dripperKeypair);
    const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
        maxRetries: 3,
    });
    const program = new Program(IDL, programId, provider);
    if (cmd === 'setupGlobalConfig') {
        await setupGlobalConfig(provider, program);
    }
}

if (require.main === module) {
    run()
        .then(() => console.log('Done!'))
        .catch((e) => console.error(e));
}