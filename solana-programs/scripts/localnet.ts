import * as anchor from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program } from '@coral-xyz/anchor'
import { DripV2 } from '@dcaf/drip-types'
import { spawn } from 'node:child_process'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    createMint,
} from '@solana/spl-token'
import { associatedAddress } from '@coral-xyz/anchor/dist/cjs/utils/token'

const localnet = spawn('anchor', ['localnet'])

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function keyPairToObject(key: Keypair) {
    return {
        pub: key.publicKey.toString(),
        priv: key.secretKey.toString(),
    }
}

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
    })
    return await response.json()
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
    })
    return await response.json()
}

async function setup() {
    const program = anchor.workspace.DripV2 as Program<DripV2>
    const provider = anchor.getProvider()
    const providerPubkey = provider.publicKey!

    const superAdmin = new Keypair()
    const fundSuperAdminIx = SystemProgram.transfer({
        fromPubkey: providerPubkey,
        toPubkey: superAdmin.publicKey,
        lamports: 100e9, // 100 SOL
    })

    await provider.sendAndConfirm?.(
        new anchor.web3.Transaction().add(fundSuperAdminIx)
    )

    const globalConfigKeypair = new Keypair()
    const [globalSignerPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-global-signer'),
            globalConfigKeypair.publicKey.toBuffer(),
        ],
        program.programId
    )
    const initGlobalConfigTxSig = await program.methods
        .initGlobalConfig({
            superAdmin: superAdmin.publicKey,
            defaultDripFeeBps: new anchor.BN(100),
        })
        .accounts({
            payer: provider.publicKey,
            globalConfig: globalConfigKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            globalConfigSigner: globalSignerPubkey,
        })
        .signers([globalConfigKeypair])
        .rpc()

    const inputTokenMintKeypair = new Keypair()
    const inputTokenMint = await createMint(
        provider.connection,
        superAdmin,
        superAdmin.publicKey,
        null,
        6,
        inputTokenMintKeypair,
        {
            commitment: 'confirmed',
        }
    )

    const outputTokenMintKeypair = new Keypair()
    const outputTokenMint = await createMint(
        provider.connection,
        superAdmin,
        superAdmin.publicKey,
        null,
        6,
        outputTokenMintKeypair,
        {
            commitment: 'confirmed',
        }
    )

    const [pairConfigPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-pair-config'),
            globalConfigKeypair.publicKey.toBuffer(),
            inputTokenMint.toBuffer(),
            outputTokenMint.toBuffer(),
        ],
        program.programId
    )

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
        .rpc()

    const dripPositions: { initTx: string; positionPubkey: string }[] = []

    for (let i = 0; i < 10; i++) {
        const dripPositionOwnerKeypair = new Keypair()
        const dripPositionKeypair = new Keypair()

        const [dripPositionSignerPubkey] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('drip-v2-drip-position-signer'),
                dripPositionKeypair.publicKey.toBuffer(),
            ],
            program.programId
        )

        const initDripPositionTxSig = await program.methods
            .initDripPosition({
                dripAmount: new anchor.BN(100),
                frequencyInSeconds: new anchor.BN(3600),
            })
            .accounts({
                payer: providerPubkey,
                owner: dripPositionOwnerKeypair.publicKey,
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
            .signers([dripPositionOwnerKeypair, dripPositionKeypair])
            .rpc()

        dripPositions.push({
            initTx: initDripPositionTxSig,
            positionPubkey: dripPositionKeypair.publicKey.toString(),
        })
    }

    await fs.writeFile(
        'mocks/setup.json',
        stringifyJSON({
            superAdmin: keyPairToObject(superAdmin),
            globalConfigKeypair: keyPairToObject(globalConfigKeypair),
            globalSignerPubkey: globalSignerPubkey.toString(),
            pairConfigPubkey: pairConfigPubkey.toString(),
            dripPositions,
            initGlobalConfigTxSig,
            initPairConfigTxSig,
        })
    )

    await delay(500)
    await fs.writeFile(
        'mocks/globalConfigAccountInfo.json',
        stringifyJSON(
            await getRawAccountInfo(globalConfigKeypair.publicKey.toString())
        )
    )
    await fs.writeFile(
        'mocks/globalSignerAccountInfo.json',
        stringifyJSON(await getRawAccountInfo(globalSignerPubkey.toString()))
    )
    await fs.writeFile(
        'mocks/initGlobalConfig.json',
        stringifyJSON(await getRawTransaction(initGlobalConfigTxSig))
    )
    await fs.writeFile(
        'mocks/missingAccountInfo.json',
        stringifyJSON(
            await getRawAccountInfo(
                'sHXA3HojCdXz9tupED61S8dnfHRqx9DaVSYv1mBqn6h'
            )
        )
    )
    console.log('Setup data written to mocks/')
}

// Propagate SIGINT to the child process
process.on('SIGINT', () => {
    localnet.kill('SIGINT')
})

localnet.stdout.on('data', (data: any) => {
    const logData = `${data}`
    if (logData && !logData.includes('Processed Slot')) {
        console.log(logData)
    }
    if (logData?.includes('JSON RPC URL')) {
        setup().then(() => {
            console.log('DONE SETUP')
        })
    }
})

localnet.stderr.on('data', (data: any) => {
    console.error(`${data}`)
})

localnet.on('close', (code: any) => {
    console.log(`child process exited with code ${code}`)
})

function stringifyJSON(obj: object): string {
    return JSON.stringify(obj, null, 2)
}
