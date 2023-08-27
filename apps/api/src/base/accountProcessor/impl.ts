import assert from 'assert';

import {
    DripPosition,
    DripPositionSigner,
    GlobalConfig,
    GlobalConfigSigner,
    PairConfig,
    processAccount,
} from '@dcaf/drip-types';
import { getAccount } from '@solana/spl-token';
import { AccountInfo, PublicKey } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { RestError } from '../../controllers/types';
import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { logger } from '../logger';
import { IAccountRepository } from '../repository';
import { IConnection } from '../rpcConnection';
import {
    dripPositionAccountToDbModel,
    dripPositionSignerAccountToDbModel,
    globalConfigAccountToDbModel,
    globalConfigSignerAccountToDbModel,
    pairConfigAccountToDbModel,
} from '../utils';

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
        const didUpsert = await processAccount<boolean>(data, {
            dripPositionAccountHandler: async (
                account: DripPosition
            ): Promise<boolean> => {
                const dripPositionWalletOwner = {
                    dripPositionPublicKey: address.toString(),
                    walletPublicKey: account.data.owner.toString(),
                };
                logger.info(
                    'upserting drip position wallet owner',
                    dripPositionWalletOwner
                );
                await this.accountRepo.upsertDripPositionWalletOwner(
                    dripPositionWalletOwner
                );
                const dbModel = dripPositionAccountToDbModel(address, account);
                logger.info('inserting drip position', {
                    address,
                    account: dbModel,
                });
                return !!(await this.accountRepo.upsertDripPosition(dbModel));
            },
            dripPositionSignerAccountHandler: async (
                account: DripPositionSigner
            ): Promise<boolean> => {
                logger.info('upserting drip position signer', {
                    dripPositionSigner: address.toString(),
                });
                return !!(await this.accountRepo.upsertDripPositionSigner(
                    dripPositionSignerAccountToDbModel(address, account)
                ));
            },
            ephemeralDripStateAccountHandler: (): Promise<boolean> => {
                throw new Error('Unexpected ephemeral state found.');
            },
            globalConfigSignerAccountHandler: async (
                account: GlobalConfigSigner
            ): Promise<boolean> => {
                logger.info('upserting global config signer', {
                    globalConfigSigner: address.toString(),
                });
                return !!(await this.accountRepo.upsertGlobalConfigSigner(
                    globalConfigSignerAccountToDbModel(address, account)
                ));
            },
            globalConfigAccountHandler: async (
                account: GlobalConfig
            ): Promise<boolean> => {
                logger.info('upserting global config', {
                    globalConfig: address.toString(),
                });
                return !!(await this.accountRepo.upsertGlobalConfig(
                    globalConfigAccountToDbModel(address, account)
                ));
            },
            pairConfigAccountHandler: async (
                account: PairConfig
            ): Promise<boolean> => {
                logger.info('upserting pair config', {
                    pairConfig: address.toString(),
                });
                return !!(await this.accountRepo.upsertPairConfig(
                    pairConfigAccountToDbModel(address, account)
                ));
            },
        });
        if (!didUpsert) {
            logger.warn('could not upsert drip account', {
                address: address.toString(),
            });
        }
    }
}
