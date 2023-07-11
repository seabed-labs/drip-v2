import { PositionHandlerBase } from './abstract';
import {
    compareSwapQuoteDesc,
    ITokenSwapHandler,
    SwapQuoteWithInstructions,
} from './index';
import { DripV2 } from '@dcaf/drip-types';
import assert from 'assert';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { notEmpty } from '../utils';
import { DripPosition } from '../positions';

export class MetaAggregator extends PositionHandlerBase {
    constructor(
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: DripPosition,
        private readonly swaps: ITokenSwapHandler[]
    ) {
        super(provider, program, dripPosition);
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
