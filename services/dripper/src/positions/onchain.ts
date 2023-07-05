import { IPosition, IPositionsFetcher } from './index';
import { Accounts } from '@dcaf/drip-types';
import { GetPositionHandler, IDripHandler } from '../dripHandler';
import { Connection, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';

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
                            bytes: bs58.encode(
                                Accounts.DripPosition.discriminator
                            ),
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
            const dripPosition = await Accounts.DripPosition.fetch(
                this.connection,
                positionKey,
                this.programId
            );
            if (!dripPosition) {
                continue;
            }
            const balance = await this.connection.getTokenAccountBalance(
                dripPosition.inputTokenAccount,
                'finalized'
            );
            if (
                BigInt(balance.value.amount) >= dripPosition.dripAmount &&
                BigInt(blockInfo) > BigInt(dripPosition.dripActivationTimestamp)
            ) {
                res.push(
                    new Position(
                        dripPosition,
                        positionKey,
                        await this.getPositionHandler(dripPosition, positionKey)
                    )
                );
            }
        }
        return res;
    }
}

export class Position implements IPosition {
    constructor(
        private readonly value: Accounts.DripPosition,
        private readonly address: PublicKey,
        private readonly handler: IDripHandler
    ) {}

    async drip(): Promise<string> {
        return this.handler.drip();
    }

    toJSON(): Accounts.DripPositionJSON {
        return this.value.toJSON();
    }

    getData(): Accounts.DripPositionFields & { publicKey: PublicKey } {
        return {
            ...this.value,
            publicKey: this.address,
        };
    }
}
