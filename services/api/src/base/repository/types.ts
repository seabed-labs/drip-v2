import { Address } from '@coral-xyz/anchor';

import type { global_config, drip_position } from 'zapatos/schema';

export interface IAccountRepository {
    getGlobalConfigs(): Promise<global_config.Selectable[]>;
    getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<drip_position.Selectable[]>;
}
