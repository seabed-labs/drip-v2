import { Address } from '@coral-xyz/anchor';
import { inject, injectable } from 'inversify';

import { drip_position } from '../../generated/prismaClient';
import { TYPES } from '../../ioCTypes';
import { IDatabase } from '../database';

import { IAccountRepository } from './types';

@injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @inject(TYPES.IDatabase)
        private readonly db: IDatabase
    ) {}

    async getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<drip_position[]> {
        return await this.db.$queryRaw<drip_position[]>`SELECT drip_position.* 
            FROM drip_position 
            JOIN drip_position_wallet_owner 
            ON drip_position.public_key = drip_position_wallet_owner.drip_position_public_key
            WHERE drip_position_wallet_owner.wallet_public_key = ${walletPublicKey.toString()}`;
    }
}
