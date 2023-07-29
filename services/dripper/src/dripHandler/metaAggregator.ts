import assert from 'assert';

import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { DripV2 } from '@dcaf/drip-types';
import { Logger } from 'winston';

import { DripPosition } from '../positions';
import { notEmpty } from '../utils';
import { DripperWallet } from '../wallet/impl';

import { PositionHandlerBase } from './abstract';

import {
    ITokenSwapHandler,
    SwapQuoteWithInstructions,
    compareSwapQuoteDesc,
} from './index';

export class MetaAggregator extends PositionHandlerBase {
    constructor(
        baseLogger: Logger,
        dripperWallet: DripperWallet,
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: DripPosition,
        private readonly swaps: ITokenSwapHandler[]
    ) {
        super(baseLogger, dripperWallet, provider, program, dripPosition);
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        const createSwapIxs = this.swaps.map((swapImpl) => {
            try {
                return swapImpl.createSwapInstructions(this.dripPosition);
            } catch (e) {
                // TODO: log unknown errors
                console.error(e);
                return undefined;
            }
        });
        const quotesWithIxs = (await Promise.all(createSwapIxs)).filter(
            notEmpty
        );
        // TODO(mocha): define error
        assert(
            quotesWithIxs.length,
            new Error('no valid quotes for meta aggregator')
        );
        quotesWithIxs.sort(compareSwapQuoteDesc);
        const [quoteWithIxs] = quotesWithIxs;
        return quoteWithIxs;
    }
}
