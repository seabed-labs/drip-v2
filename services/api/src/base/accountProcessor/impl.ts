import {
    DripPosition,
    DripPositionNftMapping,
    DripPositionSigner,
    EphemeralDripState,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
    processAccount,
} from '@dcaf/drip-types';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { RestError } from '../../controllers/types';
import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { logger } from '../logger';
import { IAccountRepository } from '../repository';
import { IConnection } from '../rpcConnection';

import { IAccountProcessor } from './types';

@injectable()
export class AccountProcessor implements IAccountProcessor {
    private readonly dripProgramId: PublicKey;
    constructor(
        @inject(TYPES.IConfig) config: IConfig,
        @inject(TYPES.IAccountRepository)
        private readonly accountRepo: IAccountRepository,
        @inject(TYPES.IConnection) private readonly connection: IConnection
    ) {
        this.dripProgramId = config.programId;
    }

    async upsertAccountByAddress(address: PublicKey): Promise<void> {
        const accountInfo = await this.connection.getAccountInfo(address);
        if (!accountInfo) {
            throw RestError.notFound(`account ${address.toString()} not found`);
        }
        return this.upsertAccountData(address, accountInfo);
    }
    async upsertAccountData(
        address: PublicKey,
        accountInfo: AccountInfo<Buffer>
    ): Promise<void> {
        switch (accountInfo.owner.toString()) {
            case this.dripProgramId.toString(): {
                return this.upsertDripAccountData(address, accountInfo.data);
            }
            default: {
                throw RestError.invalid(
                    `Unknown account owner ${accountInfo.owner.toString()}`
                );
            }
        }
    }

    async upsertDripAccountData(
        address: PublicKey,
        data: Buffer
    ): Promise<void> {
        const didUpsert = await processAccount(data, {
            dripPositionAccountHandler: function (
                account: DripPosition
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            dripPositionSignerAccountHandler: function (
                account: DripPositionSigner
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            dripPositionNftMappingAccountHandler: function (
                account: DripPositionNftMapping
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            ephemeralDripStateAccountHandler: function (
                account: EphemeralDripState
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            globalConfigSignerAccountHandler: function (
                account: GlobalConfigSigner
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            globalConfigAccountHandler: function (
                account: GlobalConfig
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
            pairConfigAccountHandler: function (
                account: PairConfig
            ): Promise<void> {
                throw new Error('Function not implemented.');
            },
        });
        if (!didUpsert) {
            logger.warn('could not upsert drip account', {
                address: address.toString(),
                data: data.toString(),
            });
        }
    }
}
