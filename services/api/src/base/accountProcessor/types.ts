import { PublicKey } from '@solana/web3.js';

export interface IAccountProcessor {
    upsertDripAccount(address: PublicKey): Promise<void>;
}
