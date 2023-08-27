import assert from 'assert';

import { PairConfigAccount } from '@dcaf/drip-types';
import { Logger } from 'winston';

import { DripPositionPendingDrip } from '../types';
import { notEmpty } from '../utils';

import { ISwapHandler, SwapQuote, SwapQuoteWithInstructions } from './index';

export class MetaAggregator implements ISwapHandler {
    constructor(
        private readonly logger: Logger,
        private readonly swaps: ISwapHandler[]
    ) {}

    async createSwapInstructions(
        dripPosition: DripPositionPendingDrip,
        pairConfig: PairConfigAccount
    ): Promise<SwapQuoteWithInstructions> {
        const createSwapIxs = this.swaps.map((swapImpl) => {
            try {
                return swapImpl.createSwapInstructions(
                    dripPosition,
                    pairConfig
                );
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

export function compareSwapQuoteDesc(a: SwapQuote, b: SwapQuote): number {
    const aQuoute = a.minOutputAmount / a.inputAmount;
    const bQuoute = b.minOutputAmount / b.inputAmount;
    if (aQuoute > bQuoute) {
        // sort a before b, e.g. [a, b]
        return -1;
    } else if (aQuoute < bQuoute) {
        // sort a after b, e.g. [b, a]
        return 1;
    }
    return 0;
}
