import { PositionHandlerBase } from './abstract';
import { ITokenSwapHandler, SwapQuoteWithInstructions } from './index';
import { Accounts, DripV2 } from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';
import assert from 'assert';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { notEmpty } from '../utils';

export class MetaAggregator extends PositionHandlerBase {
    constructor(
        provider: AnchorProvider,
        program: Program<DripV2>,
        dripPosition: Accounts.DripPosition,
        dripPositionPublicKey: PublicKey,
        private readonly swaps: ITokenSwapHandler[]
    ) {
        super(provider, program, dripPosition, dripPositionPublicKey);
    }

    async createSwapInstructions(): Promise<SwapQuoteWithInstructions> {
        const quotesWithIxs = (
            await Promise.all(
                this.swaps.map((swapImpl) => {
                    try {
                        return swapImpl.quote(this.dripPosition);
                    } catch (e) {
                        // todo: log unknown errors
                        console.error(e);
                        return undefined;
                    }
                })
            )
        ).filter(notEmpty);

        // TODO(mocha): define error
        assert(
            quotesWithIxs.length,
            new Error('no valid quotes for meta aggregator')
        );

        // TODO(mocha): impl sort
        quotesWithIxs.sort((a, b): number => {
            return 0;
        });
        const [quoteWithIxs] = quotesWithIxs;
        return quoteWithIxs;
    }
}
