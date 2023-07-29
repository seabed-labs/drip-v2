import fs from 'fs/promises';
import { spawn } from 'node:child_process';

import { BN, getProvider, workspace, Program } from '@coral-xyz/anchor';
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { DripV2 } from '@dcaf/drip-types';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountIdempotent,
    createMint,
    mintTo,
} from '@solana/spl-token';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import fetch from 'node-fetch';

import { delay, keyPairToObject, stringifyJSON } from './setup';

const localnet = spawn('anchor', ['localnet']);

async function getRawAccountInfo(address: string) {
    const response = await fetch('http://localhost:8899', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringifyJSON({
            jsonrpc: '2.0',
            id: '1',
            method: 'getAccountInfo',
            params: [
                address,
                {
                    commitment: 'confirmed',
                    encoding: 'base64',
                },
            ],
        }),
    });
    return await response.json();
}

async function getRawTransaction(txSig: string) {
    const response = await fetch('http://localhost:8899', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringifyJSON({
            jsonrpc: '2.0',
            id: '1',
            method: 'getTransaction',
            params: [
                txSig,
                {
                    commitment: 'confirmed',
                    encoding: 'json',
                },
            ],
        }),
    });
    return await response.json();
}

// TODO: Refactor to use setup.ts
async function setup() {
    const program = workspace.DripV2 as Program<DripV2>;
    const provider = getProvider();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const providerPubkey = provider.publicKey!;

    const superAdmin = Keypair.generate();
    const mintAuthority = Keypair.generate();
    const fundMintAuthorityIx = SystemProgram.transfer({
        fromPubkey: providerPubkey,
        toPubkey: mintAuthority.publicKey,
        lamports: 100e9, // 100 SOL
    });

    console.log(`Funding mint authority ${mintAuthority.publicKey.toBase58()}`);
    await provider.sendAndConfirm?.(
        new Transaction(await provider.connection.getLatestBlockhash()).add(
            fundMintAuthorityIx
        )
    );

    const globalConfigKeypair = new Keypair();
    const [globalSignerPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-global-signer'),
            globalConfigKeypair.publicKey.toBuffer(),
        ],
        program.programId
    );
    console.log(
        `Initializing global config ${globalConfigKeypair.publicKey.toBase58()}`
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

    console.log(
        `Adding provider pubkey as admin ${provider.publicKey?.toBase58()}`
    );
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

    console.log('Setting provider pubkey admin perm to dripper');
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

    const inputTokenMintKeypair = Keypair.generate();
    console.log(
        `Creating input token mint ${inputTokenMintKeypair.publicKey.toBase58()}`
    );
    const inputTokenMint = await createMint(
        provider.connection,
        mintAuthority,
        mintAuthority.publicKey,
        null,
        6,
        inputTokenMintKeypair
    );

    const outputTokenMintKeypair = new Keypair();
    console.log(
        `Creating output token mint ${outputTokenMintKeypair.publicKey.toBase58()}`
    );
    const outputTokenMint = await createMint(
        provider.connection,
        mintAuthority,
        mintAuthority.publicKey,
        null,
        6,
        outputTokenMintKeypair
    );

    const [pairConfigPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-pair-config'),
            globalConfigKeypair.publicKey.toBuffer(),
            inputTokenMint.toBuffer(),
            outputTokenMint.toBuffer(),
        ],
        program.programId
    );

    console.log(`Initializing pair config ${pairConfigPubkey.toBase58()}`);
    const initPairConfigTxSig = await program.methods
        .initPairConfig()
        .accounts({
            payer: provider.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
            inputTokenMint,
            outputTokenMint,
            pairConfig: pairConfigPubkey,
            systemProgram: SystemProgram.programId,
        })
        .rpc();

    const dripPositions: {
        initTx: string;
        positionPubkey: string;
        depositTx: string;
    }[] = [];

    for (let i = 0; i < 10; i++) {
        console.log('Processing position ', i);
        const dripPositionOwnerKeypair = new Keypair();
        const dripPositionKeypair = new Keypair();

        const [dripPositionSignerPubkey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-drip-position-signer'),
                dripPositionKeypair.publicKey.toBuffer(),
            ],
            program.programId
        );

        console.log(
            `Initializing drip position ${dripPositionKeypair.publicKey.toBase58()}`,
            JSON.stringify(
                {
                    owner: dripPositionOwnerKeypair.publicKey.toBase58(),
                },
                null,
                2
            )
        );
        const initDripPositionTxSig = await program.methods
            .initDripPosition({
                owner: dripPositionOwnerKeypair.publicKey,
                dripAmount: new BN(100),
                frequencyInSeconds: new BN(3600),
            })
            .accounts({
                payer: providerPubkey,
                globalConfig: globalConfigKeypair.publicKey,
                pairConfig: pairConfigPubkey,
                inputTokenMint,
                outputTokenMint,
                inputTokenAccount: associatedAddress({
                    mint: inputTokenMint,
                    owner: dripPositionSignerPubkey,
                }),
                outputTokenAccount: associatedAddress({
                    mint: outputTokenMint,
                    owner: dripPositionSignerPubkey,
                }),
                dripPosition: dripPositionKeypair.publicKey,
                dripPositionSigner: dripPositionSignerPubkey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .signers([dripPositionKeypair])
            .rpc();

        let depositTx: string;
        if (i % 2 === 0) {
            console.log(
                `Depositing directly into drip position ${dripPositionKeypair.publicKey.toBase58()} by minting`
            );
            // if even deposit directly
            depositTx = await mintTo(
                provider.connection,
                mintAuthority,
                inputTokenMint,
                associatedAddress({
                    mint: inputTokenMint,
                    owner: dripPositionSignerPubkey,
                }),
                mintAuthority.publicKey,
                2000e6
            );
        } else {
            // else deposit via drip-v2 program
            console.log(
                `Creating ATA for dripPositionOwner if doesn't exist already`
            );
            const dripPositionOwnerInputTokenAccount =
                await createAssociatedTokenAccountIdempotent(
                    provider.connection,
                    mintAuthority,
                    inputTokenMint,
                    dripPositionOwnerKeypair.publicKey
                );

            console.log(
                `Minting input tokens to source token account ${dripPositionOwnerInputTokenAccount.toBase58()}`
            );
            await mintTo(
                provider.connection,
                mintAuthority,
                inputTokenMint,
                dripPositionOwnerInputTokenAccount,
                mintAuthority.publicKey,
                2000e6
            );

            console.log(
                `Depositing via program into drip position ${dripPositionKeypair.publicKey.toBase58()}`
            );
            depositTx = await program.methods
                .deposit({
                    depositAmount: new BN(1000e6),
                })
                .accounts({
                    signer: dripPositionOwnerKeypair.publicKey,
                    sourceInputTokenAccount: dripPositionOwnerInputTokenAccount,
                    dripPositionInputTokenAccount: associatedAddress({
                        mint: inputTokenMint,
                        owner: dripPositionSignerPubkey,
                    }),
                    dripPosition: dripPositionKeypair.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers([dripPositionOwnerKeypair])
                .rpc();
        }

        dripPositions.push({
            initTx: initDripPositionTxSig,
            positionPubkey: dripPositionKeypair.publicKey.toString(),
            depositTx,
        });
    }

    await fs.writeFile(
        'mocks/setup.json',
        stringifyJSON({
            superAdmin: keyPairToObject(superAdmin),
            mintAuthority: keyPairToObject(mintAuthority),
            globalConfigKeypair: keyPairToObject(globalConfigKeypair),
            globalSignerPubkey: globalSignerPubkey.toString(),
            pairConfigPubkey: pairConfigPubkey.toString(),
            dripPositions,
            initGlobalConfigTxSig,
            initPairConfigTxSig,
            addProviderAsAdminTxSig,
            setProviderPermToDripperTxSig,
        })
    );

    await delay(500);
    await fs.writeFile(
        'mocks/globalConfigAccountInfo.json',
        stringifyJSON(
            await getRawAccountInfo(globalConfigKeypair.publicKey.toString())
        )
    );
    await fs.writeFile(
        'mocks/globalSignerAccountInfo.json',
        stringifyJSON(await getRawAccountInfo(globalSignerPubkey.toString()))
    );
    await fs.writeFile(
        'mocks/initGlobalConfig.json',
        stringifyJSON(await getRawTransaction(initGlobalConfigTxSig))
    );
    await fs.writeFile(
        'mocks/missingAccountInfo.json',
        stringifyJSON(
            await getRawAccountInfo(
                'sHXA3HojCdXz9tupED61S8dnfHRqx9DaVSYv1mBqn6h'
            )
        )
    );
    console.log('Setup data written to mocks/');
}

// Propagate SIGINT to the child process
process.on('SIGINT', () => {
    localnet.kill('SIGINT');
});

localnet.stdout.on('data', (data: any) => {
    const logData = `${data}`;
    if (logData && !logData.includes('Processed Slot')) {
        console.log(logData);
    }
    if (logData?.includes('JSON RPC URL')) {
        setup().then(() => {
            console.log('DONE SETUP');
        });
    }
});

localnet.stderr.on('data', (data: any) => {
    console.error(`${data}`);
});

localnet.on('close', (code: any) => {
    console.log(`child process exited with code ${code}`);
});
