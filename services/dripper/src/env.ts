// TODO(mocha): shouldn't have to ts-ignore this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export const programId: string | undefined = process.env.DRIP_PROGRAM_ID;

export const dripperSeedPhrase = process.env.DRIPPER_ROOT_SEED_PHRASE;
export const cluster = process.env.CLUSTER || 'mainnet-beta';

export const rpcUrl: string =
    process.env.DRIPPER_RPC_URL ||
    'https://mainnet.helius-rpc.com/?api-key=7a4bbcd8-5147-4a6b-b087-7be92b65170d';
// yarn run ts-node ./scripts/setup.ts "enableDripperPermissions" "D9yEfY8scwLdJjDLwGumrV2mTywWMhphXwqERoajqM6F"
