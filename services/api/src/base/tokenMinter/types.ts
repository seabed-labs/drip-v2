import { PublicKey } from '@solana/web3.js';

export interface ITokenMinter {
    mintTo(
        mint: PublicKey,
        address: PublicKey,
        amount: bigint
    ): Promise<string>;
}
