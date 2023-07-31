import { Address } from '@coral-xyz/anchor';
import { inject } from 'inversify';
import * as db from 'zapatos/db';

import { TYPES } from '../../ioCTypes';
import { IDatabasePool } from '../databasePool';

import { IAccountRepository } from './types';

import type * as s from 'zapatos/schema';

export class AccountRepository implements IAccountRepository {
    constructor(
        @inject(TYPES.IDatabasePool)
        private readonly dbPool: IDatabasePool
    ) {}

    async getGlobalConfigs(): Promise<s.global_config.Selectable[]> {
        throw new Error('Method not implemented.');
    }

    async getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<s.drip_position.Selectable[]> {
        return db.sql<
            s.drip_position.SQL | s.drip_position_wallet_owner.SQL,
            s.drip_position.Selectable[]
        >`
  SELECT ${'drip_position'}.* 
  FROM ${'drip_position'} 
  JOIN ${'drip_position_wallet_owner'} 
  ON ${'drip_position'}.${'public_key'} = ${'drip_position_wallet_owner'}.${'drip_position_public_key'}
  WHERE ${'drip_position_wallet_owner'}.${'wallet_public_key'} = ${db.param(
            walletPublicKey.toString()
        )}
  `.run(this.dbPool);
    }
}
