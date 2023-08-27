import assert from 'assert';

import { DripPosition } from '@dcaf/drip-types';
import { Connection, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { Logger } from 'winston';

import { IPosition } from '../position';
import { Position } from '../position/impl';
import { GetPositionHandler } from '../swapHandler';
import { DripPositionPendingDrip } from '../types';
import { DEFAULT_COMMITMENT, tryWithReturn } from '../utils';

import { IPositionsFetcher } from '.';

export class OnChainPositionsFetcher implements IPositionsFetcher {
    whitelist = ['5jyB8Ta5khzZpKgBJTpqV6frJcGkrB96dqBqzhjC3ka3'];

    constructor(
        private readonly logger: Logger,
        private readonly programId: PublicKey,
        private readonly connection: Connection,
        private readonly getPositionHandler: GetPositionHandler
    ) {}

    /**
     *
     * @param limit the maximum number of positions that are returned
     * @param filterPosition if true, the position will be included in the response
     * @returns
     */
    async getPositionsToDrip(limit = 50): Promise<IPosition[]> {
        const accounts = await this.connection.getProgramAccounts(
            this.programId,
            {
                commitment: DEFAULT_COMMITMENT,
                dataSlice: { offset: 0, length: 0 },
                filters: [
                    {
                        memcmp: {
                            /** offset into program account data to start comparison */
                            offset: 0,
                            /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                            bytes: bs58.encode(DripPosition.discriminator),
                        },
                    },
                ],
            }
        );
        // TODO: remove filter
        // just skipping positions made with small drip amount
        const positionKeys = accounts
            .map((account) => account.pubkey)
            .filter((account) => this.whitelist.includes(account.toString()));

        const positionAccounts: DripPositionPendingDrip[] = [];

        for (
            let i = 0;
            i < positionKeys.length && positionAccounts.length < limit;
            i++
        ) {
            const positionKey = positionKeys[i];
            const dripPositionWithAddress = await tryWithReturn(
                this.logger,
                async () => {
                    const dripPositionAccount =
                        await DripPosition.fetchNonNullableData(
                            this.connection,
                            positionKey,
                            this.programId
                        );
                    const balance =
                        await this.connection.getTokenAccountBalance(
                            dripPositionAccount.inputTokenAccount,
                            'finalized'
                        );
                    const epochInfo = await this.connection.getEpochInfo();
                    const blockTime = await this.connection.getBlockTime(
                        epochInfo.absoluteSlot
                    );
                    assert(blockTime, new Error('failed to get blockInfo'));
                    if (
                        BigInt(balance.value.amount) == BigInt(0) ||
                        BigInt(blockTime) <
                            BigInt(dripPositionAccount.dripActivationTimestamp)
                    ) {
                        return undefined;
                    }

                    return {
                        data: await DripPosition.fetchNonNullableData(
                            this.connection,
                            positionKey,
                            this.programId
                        ),
                        address: positionKey,
                        dripAmountToFill:
                            dripPositionAccount.dripAmountRemainingPostFeesInCurrentCycle,
                    };
                },
                (e) => {
                    this.logger
                        .data({
                            position: positionKey.toString(),
                            error: JSON.stringify(e),
                        })
                        .warn('failed to fetch position');
                    return undefined;
                }
            );
            if (dripPositionWithAddress) {
                positionAccounts.push(dripPositionWithAddress);
            }
        }
        return positionAccounts.map((positionAccount) => {
            return new Position(
                this.logger,
                this.programId,
                positionAccount,
                this.getPositionHandler(positionAccount.data)
            );
        });
    }
}
