import type { global_config } from 'zapatos/schema';

export interface IAccountRepository {
    getGlobalConfigs(): global_config.Selectable[];
}
