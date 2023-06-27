// TODO(mocha): shouldn't have to ts-ignore this
// @ts-ignore
import dripper_local_key from '../local.json'
import { Keypair } from '@solana/web3.js'

export const programId: string | undefined = process.env.DRIP_PROGRAM_ID

export const cluster = process.env.cluster || 'mainnet-beta'

export const rpcUrl: string =
    process.env.DRIPPER_RPC_URL ||
    'https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d'

// TODO(mocha/breve): move this to something like kms
export const dripperKeypair: Keypair =
    Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(process.env.DRIPPER_KEY_PAIR!))
    ) || Keypair.fromSecretKey(Uint8Array.from(dripper_local_key))
