import { AccountInfo, PublicKey } from '@solana/web3.js';

export interface IAccountProcessor {
    upsertAccountByAddress(address: PublicKey): Promise<void>;
    upsertAccountData(
        address: PublicKey,
        accountInfo: AccountInfo<Buffer>
    ): Promise<void>;
}
