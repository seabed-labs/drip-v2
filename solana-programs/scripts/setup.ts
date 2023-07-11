import dotenv from 'dotenv';
dotenv.config({
    path: './scripts/staging.env',
});

import { AnchorProvider, BN, Program, Wallet } from '@coral-xyz/anchor';
import { DripV2, IDL, Accounts } from '@dcaf/drip-types';
import {
    Connection,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';
import fs from 'fs/promises';
import * as anchor from '@coral-xyz/anchor';
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    createSyncNativeInstruction,
    createTransferInstruction,
    getAccount,
    getAssociatedTokenAddress,
    getMinimumBalanceForRentExemptAccount,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { mnemonicToSeed } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';

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

export async function sendSol(
    provider: AnchorProvider,
    destinationTokenAccount: PublicKey,
    amount: BN
): Promise<void> {
    const wSolAta = await getAssociatedTokenAddress(
        NATIVE_MINT,
        provider.publicKey
    );
    const wSolAtaInfo = await provider.connection.getAccountInfo(wSolAta);
    const wSolAtaExists = !!wSolAtaInfo;
    const depositForRentExemption = await getMinimumBalanceForRentExemptAccount(
        provider.connection
    );

    const ixs: TransactionInstruction[] = [];
    let solToTransfer: BN = amount;

    if (wSolAtaExists) {
        const wSolAtaWrappableSolBalance =
            wSolAtaInfo.lamports - depositForRentExemption;
        const wSolAtaAccount = await getAccount(provider.connection, wSolAta);
        const wSolAtaWSolBalance = wSolAtaAccount.amount;
        if (amount.lte(new BN(wSolAtaWSolBalance.toString()))) {
            // Owner already has enough WSOL
        } else {
            solToTransfer = BN.max(
                solToTransfer.sub(
                    new BN(wSolAtaWrappableSolBalance.toString())
                ),
                new BN(0)
            );
        }
    } else {
        const createWSolAtaIx = createAssociatedTokenAccountInstruction(
            provider.publicKey,
            wSolAta,
            provider.publicKey,
            NATIVE_MINT
        );
        ixs.push(createWSolAtaIx);
    }

    if (solToTransfer.gtn(0)) {
        const fundWSolAtaIx = SystemProgram.transfer({
            fromPubkey: provider.publicKey,
            toPubkey: wSolAta,
            lamports: BigInt(solToTransfer.toString()),
        });
        ixs.push(fundWSolAtaIx);
    }

    const syncNativeIx = createSyncNativeInstruction(wSolAta);
    ixs.push(syncNativeIx);

    ixs.push(
        createTransferInstruction(
            wSolAta,
            destinationTokenAccount,
            provider.publicKey,
            BigInt(amount.toString())
        )
    );
    const tx = new Transaction({
        feePayer: provider.publicKey,
    });
    tx.add(...ixs);
    const sendWSolTxSig = await provider.sendAndConfirm(tx);
    console.log('sendWSolTxSig', sendWSolTxSig);
}

export async function deposit(
    provider: AnchorProvider,
    program: Program<DripV2>,
    dripPositionPub: PublicKey,
    amount: bigint
): Promise<void> {
    const dripPosition = await Accounts.DripPosition.fetch(
        provider.connection,
        dripPositionPub,
        program.programId
    );
    if (!dripPosition) {
        throw new Error('ERROR');
    }
    const { address } = await maybeInitAta(
        provider,
        dripPosition.inputTokenMint,
        provider.publicKey
    );

    const ix = await createTransferInstruction(
        address,
        dripPosition.inputTokenAccount,
        provider.publicKey,
        amount
    );

    const tx = new Transaction().add(ix);
    const txSig = await provider.sendAndConfirm(tx);
    console.log('transferTxSig', txSig);
}

export async function createPosition(
    provider: AnchorProvider,
    program: Program<DripV2>,
    globalConfig: PublicKey,
    inputTokenMint: PublicKey,
    outputTokenMint: PublicKey,
    positionOwner: PublicKey,
    dripAmount: BN
): Promise<void> {
    const { instruction: initOwnerInputTa } = await maybeInitAta(
        provider,
        inputTokenMint,
        positionOwner
    );
    const { instruction: initOwnerOutputTa } = await maybeInitAta(
        provider,
        outputTokenMint,
        positionOwner
    );
    const { address: pairConfig, instruction: initPairConfigIx } =
        await maybeInitPairConfig(
            provider,
            program,
            globalConfig,
            inputTokenMint,
            outputTokenMint
        );
    const preInstructions: TransactionInstruction[] = [];
    if (initOwnerInputTa) {
        preInstructions.push(initOwnerInputTa);
    }
    if (initOwnerOutputTa) {
        preInstructions.push(initOwnerOutputTa);
    }
    if (initPairConfigIx) {
        preInstructions.push(initPairConfigIx);
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
            dripAmount: dripAmount,
            frequencyInSeconds: new anchor.BN(30),
            owner: positionOwner,
        })
        .accounts({
            payer: provider.publicKey,
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
        .preInstructions(preInstructions)
        .signers([dripPositionKeypair])
        .rpc();
    console.log('initDripPositionTxSig', initDripPositionTxSig);
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

export async function setNewDripperPermissions(
    provider: AnchorProvider,
    program: Program<DripV2>,
    superAdmin: Keypair,
    globalConfig: PublicKey
): Promise<void> {
    const globalConfigAccount = await Accounts.GlobalConfig.fetch(
        provider.connection,
        globalConfig,
        program.programId
    );
    if (!globalConfigAccount) {
        throw new Error('invalid config');
    }
    const index = globalConfigAccount.admins.findIndex(
        (admin) => admin.toString() === PublicKey.default.toString()
    );
    if (index === undefined) {
        throw new Error('no empty slot');
    }
    console.log(`adding admin to index ${index}`);

    const addProviderAsAdminTxSig = await program.methods
        .updateAdmin({
            adminIndex: new BN(index),
            adminChange: {
                setAdminAndResetPermissions: [provider.publicKey],
            },
        })
        .accounts({
            signer: superAdmin.publicKey,
            globalConfig: globalConfig,
        })
        .signers([superAdmin])
        .rpc();
    console.log('addProviderAsAdminTxSig', addProviderAsAdminTxSig);
    const setProviderPermToDripperTxSig = await program.methods
        .updateAdmin({
            adminIndex: new BN(index),
            adminChange: {
                addPermission: [{ drip: {} }],
            },
        })
        .accounts({
            signer: superAdmin.publicKey,
            globalConfig: globalConfig,
        })
        .signers([superAdmin])
        .rpc();
    console.log('setProviderPermToDripperTxSig', setProviderPermToDripperTxSig);
}

async function run() {
    const [, , cmd, ...cmdArgs] = process.argv;
    const mnemonicSeed = await mnemonicToSeed(process.env.DRIPPER_SEED_PHRASE!);

    const derivedSeed = derivePath(
        "m/44'/501'",
        mnemonicSeed.toString('hex')
    ).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const dripperKeypair = Keypair.fromSecretKey(secret);
    console.log('dripper', dripperKeypair.publicKey.toString());

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
    } else if (cmd === 'createPosition') {
        if (
            cmdArgs.length < 5 ||
            cmdArgs[0] === '--help' ||
            cmdArgs[0] === '-h'
        ) {
            console.log(
                'usage: createPosition <globalConfig> <inputTokenMint> <outputTokenMint> <positionOwner> <dripAmount>'
            );
            console.log(`got ${cmdArgs.length} args but expected 4`);
            return;
        }
        const globalConfig = new PublicKey(cmdArgs[0]);
        const inputTokenMint = new PublicKey(cmdArgs[1]);
        const outputTokenMint = new PublicKey(cmdArgs[2]);
        const positionOwner = new PublicKey(cmdArgs[3]);
        const dripAmount = new BN(cmdArgs[4]);
        await createPosition(
            provider,
            program,
            globalConfig,
            inputTokenMint,
            outputTokenMint,
            positionOwner,
            dripAmount
        );
    } else if (cmd === 'sendSol') {
        if (
            cmdArgs.length < 2 ||
            cmdArgs[0] === '--help' ||
            cmdArgs[0] === '-h'
        ) {
            console.log('usage: createPosition <destinationTa> <uiAmount>');
            console.log(`got ${cmdArgs.length} args but expected 2`);
            return;
        }
        const destinationTa = new PublicKey(cmdArgs[0]);
        const uiAmount = Number(cmdArgs[1]);
        const amountInLamports = new BN(LAMPORTS_PER_SOL * uiAmount);
        await sendSol(provider, destinationTa, amountInLamports);
    } else if (cmd === 'deposit') {
        if (
            cmdArgs.length < 2 ||
            cmdArgs[0] === '--help' ||
            cmdArgs[0] === '-h'
        ) {
            console.log('usage: createPosition <dripPosition> <amount>');
            console.log(`got ${cmdArgs.length} args but expected 2`);
            return;
        }
        const position = new PublicKey(cmdArgs[0]);
        const amount = Number(cmdArgs[1]);
        await deposit(provider, program, position, BigInt(amount));
    } else if (cmd === 'enableDripperPermissions') {
        if (
            cmdArgs.length < 1 ||
            cmdArgs[0] === '--help' ||
            cmdArgs[0] === '-h'
        ) {
            console.log('usage: createPosition <newDripperPubkey>');
            console.log(`got ${cmdArgs.length} args but expected 1`);
            return;
        }
        const superAdminKeypair = Keypair.fromSecretKey(
            Uint8Array.from(JSON.parse(process.env.SUPER_ADMIN!))
        );
        const globalConfig = new PublicKey(cmdArgs[0]);
        await setNewDripperPermissions(
            provider,
            program,
            superAdminKeypair,
            globalConfig
        );
    }
}

if (require.main === module) {
    run()
        .then(() => console.log('Done!'))
        .catch((e) => console.error(e));
}
