import { IAccountRepository } from './types';

import type { global_config } from 'zapatos/schema';

export class AccountRepository implements IAccountRepository {
    getGlobalConfigs(): global_config.Selectable[] {
        throw new Error('Method not implemented.');
    }
}
