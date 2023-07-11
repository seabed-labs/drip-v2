export const programId: string | undefined = process.env.DRIP_PROGRAM_ID;

export const dripperSeedPhrase = process.env.DRIPPER_ROOT_SEED_PHRASE;
export const cluster = process.env.CLUSTER || 'mainnet-beta';

export const rpcUrl: string =
    process.env.DRIPPER_RPC_URL ||
    'https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d';
