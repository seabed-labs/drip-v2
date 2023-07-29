import { AnchorProvider } from '@coral-xyz/anchor';
import { DripPositionAccount, DripPositionAccountJSON } from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';

import { DripPositionAccountWithAddress } from '../types';

export interface IPosition {
    get address(): PublicKey;
    get account(): DripPositionAccount;
    get accountWithAddress(): DripPositionAccountWithAddress;

    toJSON(): DripPositionAccountJSON;
    drip(provider: AnchorProvider): Promise<string>;
}
