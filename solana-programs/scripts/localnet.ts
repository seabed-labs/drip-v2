import * as anchor from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram } from '@solana/web3.js'
import { Program } from '@coral-xyz/anchor'
import { DripV2 } from '@dcaf/drip-types'
import { spawn } from 'node:child_process';
import fs from 'fs/promises';
import fetch from 'node-fetch';

const localnet = spawn('anchor', ['localnet']);

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
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getAccountInfo",
      params: [
        address,
        {
          encoding: "base64"
        }
      ]
    })
  });
  return await response.json();
}

async function getRawTransaction(txSig: string) {
  const response = await fetch('http://localhost:8899', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getTransaction",
      params: [
        txSig,
        {
          commitment: "confirmed",
          encoding: 'json'
        }
      ]
    })
  });
  return await response.json();
}

async function setup() {
  const program = anchor.workspace.DripV2 as Program<DripV2>
  const provider = anchor.getProvider()

  const globalConfigKeypair = new Keypair()
  const superAdmin = new Keypair()
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

  await fs.writeFile("mocks/setup.json", JSON.stringify({
    superAdmin: keyPairToObject(superAdmin),
    globalConfigKeypair: keyPairToObject(globalConfigKeypair),
    globalSignerPubkey: globalSignerPubkey.toString(),
    initGlobalConfigTxSig,
  }));

  await fs.writeFile("mocks/globalConfigAccountInfo.json", JSON.stringify(await getRawAccountInfo(globalConfigKeypair.publicKey.toString())))
  await fs.writeFile("mocks/globalSigner.json", JSON.stringify(await getRawAccountInfo(globalSignerPubkey.toString())))
  await fs.writeFile("mocks/initGlobalConfig.json", JSON.stringify(await getRawTransaction(initGlobalConfigTxSig)))
  console.log("Setup data written to mocks/")
}

// Propagate SIGINT to the child process
process.on('SIGINT', () => {
  localnet.kill('SIGINT');
});

localnet.stdout.on('data', (data: any) => {
  const logData = `${data}`
  if (logData && !logData.includes("Processed Slot")) {
    console.log(logData)
  }
  if (logData?.includes("JSON RPC URL")) {
    setup().then(() => {
      console.log("DONE SETUP")
    })
  }
});

localnet.stderr.on('data', (data: any) => {
  console.error(`${data}`);
});

localnet.on('close', (code: any) => {
  console.log(`child process exited with code ${code}`);
});


