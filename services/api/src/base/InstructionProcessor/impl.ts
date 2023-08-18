import {
    ClosePosition,
    CollectFees,
    Deposit,
    InitDripPosition,
    InitGlobalConfig,
    InitPairConfig,
    PostDrip,
    PreDrip,
    ToggleAutoCredit,
    UpdateAdmin,
    UpdateDefaultDripFees,
    UpdateDefaultPairDripFees,
    UpdatePythPriceFeed,
    UpdateSuperAdmin,
    processInstruction,
} from '@dcaf/drip-types';
import {
    VersionedTransactionResponse,
    MessageAccountKeys,
    MessageCompiledInstruction,
    PublicKey,
} from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { IConfig } from '../config';
import { logger } from '../logger';
import { notEmpty } from '../utils';

import { IInstructionProcessor } from './types';

@injectable()
export class DripInstructionProcessor implements IInstructionProcessor {
    private readonly programId: PublicKey;

    constructor(@inject(TYPES.IConfig) config: IConfig) {
        this.programId = config.programId;
    }

    // TODO(mocha): create schema for these instructions
    // TODO(mocha): insert decoded ix data to db
    async upsertInstruction(
        tx: VersionedTransactionResponse,
        accountKeys: MessageAccountKeys,
        ix: MessageCompiledInstruction
    ): Promise<void> {
        const ixAccounts = ix.accountKeyIndexes
            .map((i) => accountKeys.get(i))
            .filter(notEmpty);
        const upsertedIx = await processInstruction<boolean>(
            this.programId,
            ix.data,
            ixAccounts,
            {
                initGlobalConfigIxHandler: function (
                    ix: InitGlobalConfig
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                initPairConfigIxHandler: function (
                    ix: InitPairConfig
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                updateSuperAdminIxHandler: function (
                    ix: UpdateSuperAdmin
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                updateAdminIxHandler: function (
                    ix: UpdateAdmin
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                updateDefaultDripFeesIxHandler: function (
                    ix: UpdateDefaultDripFees
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                updatePythPriceFeedIxHandler: function (
                    ix: UpdatePythPriceFeed
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                updateDefaultPairDripFeesIxHandler: function (
                    ix: UpdateDefaultPairDripFees
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                collectFeesIxHandler: function (
                    ix: CollectFees
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                initDripPositionIxHandler: function (
                    ix: InitDripPosition
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                toggleAutoCreditIxHandler: function (
                    ix: ToggleAutoCredit
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                depositIxHandler: function (ix: Deposit): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                closePositionIxHandler: function (
                    ix: ClosePosition
                ): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                preDripIxHandler: function (ix: PreDrip): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
                postDripIxHandler: function (ix: PostDrip): Promise<boolean> {
                    logger.info('processing ix', { name: ix.ixName });
                    return Promise.resolve(true);
                },
            }
        );
        if (!upsertedIx) {
            logger.warn('unknown drip ix', {
                ixName: ix.data.slice(0, 8).toString(),
            });
        }
    }
}
