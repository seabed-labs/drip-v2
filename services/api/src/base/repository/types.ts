import { Address } from '@coral-xyz/anchor';

import { drip_position } from '../../generated/prismaClient';

export interface IAccountRepository {
    getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<drip_position[]>;
}
