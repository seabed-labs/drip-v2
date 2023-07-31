import {
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
} from '@dcaf/drip-types';
import {
    VersionedTransactionResponse,
    MessageAccountKeys,
    MessageCompiledInstruction,
} from '@solana/web3.js';
import { injectable } from 'inversify';

import { logger } from '../logger';

import { IInstructionProcessor } from './types';

@injectable()
export class DripInstructionProcessor implements IInstructionProcessor {
    // TODO(mocha): create schema for these instructions
    // TODO(mocha): insert decoded ix data to db
    upsertInstruction(
        tx: VersionedTransactionResponse,
        accountKeys: MessageAccountKeys,
        ix: MessageCompiledInstruction
    ): Promise<void> {
        const identifier = Buffer.from(ix.data.slice(0, 8));
        const name = identifier.toString();
        // TODO: We can code gen these large if/else-ifs and pass in handler callbacks
        // this ensures we never miss an ix handling and need to explicity handle it
        // TODO: Close position missing from codegen
        // https://github.com/dcaf-labs/anchor-client-gen/issues/16
        if (CollectFees.isIdentifierEqual(Buffer.from(ix.data))) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(Deposit.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(DetokenizeDripPosition.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(InitDripPositionNft.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(InitDripPosition.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(InitGlobalConfig.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(InitPairConfig.identifier)) {
            console.log(name);
        } else if (identifier.equals(PostDrip.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(PreDrip.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(ToggleAutoCredit.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(TokenizeDripPosition.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(UpdateAdmin.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(UpdateDefaultDripFees.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(UpdateDefaultPairDripFees.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(UpdatePythPriceFeed.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(UpdateSuperAdmin.identifier)) {
            logger.info('parsing ix', { name });
        } else if (identifier.equals(Withdraw.identifier)) {
            logger.info('parsing ix', { name });
        } else {
            logger.error('unable to parse drip instruction', { name });
        }
        return Promise.resolve();
    }
}
