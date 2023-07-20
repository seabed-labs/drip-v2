import { DripPositionAccount } from '@dcaf/drip-types/src/accounts/DripPosition';
import { PublicKey } from '@solana/web3.js';

export type DripPosition = {
    address: PublicKey;
    data: DripPositionAccount;
};
export interface IPositionsFetcher {
    getPositionsPendingDrip(limit?: number): Promise<IPosition[]>;
}

export interface IPosition {
    drip(): Promise<string>;
    getData(): DripPosition;
}
