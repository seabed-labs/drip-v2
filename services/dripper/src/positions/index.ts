import { Accounts } from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

export interface IPositionsFetcher {
    getPositionsPendingDrip(limit?: number): Promise<IPosition[]>;
}

export interface IPosition {
    drip(): Promise<string>;
    // define this type somewhere
    getData(): Accounts.DripPositionFields & { publicKey: PublicKey };
}
