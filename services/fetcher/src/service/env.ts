export const programId: string | undefined = process.env.DRIP_PROGRAM_ID;

export const rpcUrl: string =
    process.env.FETCHER_RPC_URL ||
    'https://quick-dark-dust.solana-mainnet.discover.quiknode.pro/67c6e7fd9430ec7c3cf355ce177b058d653a416e';
