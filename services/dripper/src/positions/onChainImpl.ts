import {
    DripPositionAccount,
    DripPositionAccountJSON,
    DripPosition as DripPositionClass,
} from '@dcaf/drip-types/src/accounts';
import { Connection, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';

import { GetPositionHandler, IDripHandler } from '../dripHandler';

import { DripPosition, IPosition, IPositionsFetcher } from './index';

export class OnChainPositionsFetcher implements IPositionsFetcher {
    constructor(
        private readonly programId: PublicKey,
        private readonly connection: Connection,
        private readonly getPositionHandler: GetPositionHandler
    ) {}

    // TODO: take into account fees
    async getPositionsPendingDrip(limit = 20): Promise<IPosition[]> {
        // use on-chain time, not real-world time!
        const epochInfo = await this.connection.getEpochInfo();
        const blockInfo = await this.connection.getBlockTime(
            epochInfo.absoluteSlot
        );
        if (!blockInfo) {
            // TODO: define error
            throw new Error('failed to get blockInfo');
        }
        const res: IPosition[] = [];
        const accounts = await this.connection.getProgramAccounts(
            this.programId,
            {
                commitment: 'finalized',
                dataSlice: { offset: 0, length: 0 },
                filters: [
                    {
                        memcmp: {
                            /** offset into program account data to start comparison */
                            offset: 0,
                            /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                            bytes: bs58.encode(DripPositionClass.discriminator),
                        },
                    },
                ],
            }
        );
        // TODO: remove filter
        // just skipping positions made with small drip amount
        const positionKeys = accounts
            .map((account) => account.pubkey)
            .filter(
                (account) =>
                    account.toString() ===
                    '5jyB8Ta5khzZpKgBJTpqV6frJcGkrB96dqBqzhjC3ka3'
            );
        let i = 0;
        while (i < positionKeys.length && res.length < limit) {
            const positionKey = positionKeys[i];
            i += 1;
            const dripPositionAccount =
                await DripPositionClass.fetchNullableData(
                    this.connection,
                    positionKey,
                    this.programId
                );
            if (!dripPositionAccount) {
                continue;
            }
            const balance = await this.connection.getTokenAccountBalance(
                dripPositionAccount.inputTokenAccount,
                'finalized'
            );
            if (
                // TODO: support partial drips
                BigInt(balance.value.amount) >=
                    dripPositionAccount.dripAmountRemainingPostFeesInCurrentCycle &&
                BigInt(blockInfo) >
                    BigInt(dripPositionAccount.dripActivationTimestamp)
            ) {
                res.push(
                    new Position(
                        dripPositionAccount,
                        positionKey,
                        await this.getPositionHandler({
                            address: positionKey,
                            data: dripPositionAccount,
                        })
                    )
                );
            }
        }
        return res;
    }
}

export class Position implements IPosition {
    constructor(
        private readonly value: DripPositionAccount,
        private readonly address: PublicKey,
        private readonly handler: IDripHandler
    ) {}

    async drip(): Promise<string> {
        return this.handler.drip();
    }

    toJSON(): DripPositionAccountJSON {
        return DripPositionClass.toJSON(this.value);
    }

    getData(): DripPosition {
        return {
            address: this.address,
            data: {
                ...this.value,
            },
        };
    }
}
