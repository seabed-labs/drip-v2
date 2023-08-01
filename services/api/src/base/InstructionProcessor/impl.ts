import {
    ClosePosition,
    CollectFees,
    Deposit,
    DetokenizeDripPosition,
    InitDripPosition,
    InitDripPositionNft,
    InitGlobalConfig,
    InitPairConfig,
    PostDrip,
    PreDrip,
    ToggleAutoCredit,
    TokenizeDripPosition,
    UpdateAdmin,
    UpdateDefaultDripFees,
    UpdateDefaultPairDripFees,
    UpdatePythPriceFeed,
    UpdateSuperAdmin,
    Withdraw,
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
        const upsertedIx = await processInstruction(
            this.programId,
            ix.data,
            ixAccounts,
            {
                initGlobalConfigIxHandler: function (
                    ix: InitGlobalConfig
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                initPairConfigIxHandler: function (
                    ix: InitPairConfig
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                updateSuperAdminIxHandler: function (
                    ix: UpdateSuperAdmin
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                updateAdminIxHandler: function (
                    ix: UpdateAdmin
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                updateDefaultDripFeesIxHandler: function (
                    ix: UpdateDefaultDripFees
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                updatePythPriceFeedIxHandler: function (
                    ix: UpdatePythPriceFeed
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                updateDefaultPairDripFeesIxHandler: function (
                    ix: UpdateDefaultPairDripFees
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                collectFeesIxHandler: function (
                    ix: CollectFees
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                initDripPositionIxHandler: function (
                    ix: InitDripPosition
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                initDripPositionNftIxHandler: function (
                    ix: InitDripPositionNft
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                tokenizeDripPositionIxHandler: function (
                    ix: TokenizeDripPosition
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                detokenizeDripPositionIxHandler: function (
                    ix: DetokenizeDripPosition
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                toggleAutoCreditIxHandler: function (
                    ix: ToggleAutoCredit
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                depositIxHandler: function (ix: Deposit): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                closePositionIxHandler: function (
                    ix: ClosePosition
                ): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                withdrawIxHandler: function (ix: Withdraw): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                preDripIxHandler: function (ix: PreDrip): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
                },
                postDripIxHandler: function (ix: PostDrip): Promise<void> {
                    logger.info('processing ix', { name: ix.ixName });
                    throw new Error('Function not implemented.');
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
