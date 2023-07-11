import { Accounts } from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

export type DripPosition = {
    address: PublicKey;
    data: Accounts.DripPositionFields;
};
export interface IPositionsFetcher {
    getPositionsPendingDrip(limit?: number): Promise<IPosition[]>;
}

export interface IPosition {
    drip(): Promise<string>;
    getData(): DripPosition;
}
