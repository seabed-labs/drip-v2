import { Address } from '@coral-xyz/anchor';
import { inject, injectable } from 'inversify';

import {
    DripPosition,
    DripPositionSigner,
    DripPositionWalletOwner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
} from '../../generated/prismaClient';
import { TYPES } from '../../ioCTypes';
import { IDatabase } from '../database';

import { IAccountRepository } from './types';

@injectable()
export class AccountRepository implements IAccountRepository {
    constructor(
        @inject(TYPES.IDatabase)
        private readonly db: IDatabase
    ) {}

    async upsertDripPositionWalletOwner(
        a: DripPositionWalletOwner
    ): Promise<DripPositionWalletOwner> {
        return this.db.dripPositionWalletOwner.upsert({
            where: { dripPositionPublicKey: a.dripPositionPublicKey },
            create: a,
            update: a,
        });
    }

    async upsertDripPosition(a: DripPosition): Promise<DripPosition> {
        return this.db.dripPosition.upsert({
            where: { publicKey: a.publicKey },
            create: a,
            update: a,
        });
    }

    async upsertDripPositionSigner(
        a: DripPositionSigner
    ): Promise<DripPositionSigner> {
        return this.db.dripPositionSigner.upsert({
            where: { publicKey: a.publicKey },
            create: a,
            update: a,
        });
    }

    async upsertGlobalConfigSigner(
        a: GlobalConfigSigner
    ): Promise<GlobalConfigSigner> {
        return this.db.globalConfigSigner.upsert({
            where: { publicKey: a.publicKey },
            create: a,
            update: a,
        });
    }

    async upsertGlobalConfig(a: GlobalConfig): Promise<GlobalConfig> {
        return this.db.globalConfig.upsert({
            where: { publicKey: a.publicKey },
            create: a,
            update: a,
        });
    }

    async upsertPairConfig(a: PairConfig): Promise<PairConfig> {
        return this.db.pairConfig.upsert({
            where: { publicKey: a.publicKey },
            create: a,
            update: a,
        });
    }

    async getDripPositionsForWallet(
        walletPublicKey: Address
    ): Promise<DripPosition[]> {
        return this.db.$queryRaw<DripPosition[]>`SELECT drip_position.* 
            FROM drip_position 
            JOIN drip_position_wallet_owner 
            ON drip_position.public_key = drip_position_wallet_owner.drip_position_public_key
            WHERE drip_position_wallet_owner.wallet_public_key = ${walletPublicKey.toString()}`;
    }
}
