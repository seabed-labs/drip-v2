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

    async getPositionsPendingDrip(limit = 20): Promise<IPosition[]> {
        const res: IPosition[] = [];
        const accounts = await this.connection.getProgramAccounts(
            this.programId,
            {
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
        const positionKeys = accounts.map((account) => account.pubkey);
        let i = 0;
        while (i < positionKeys.length && res.length < limit) {
            const positionKey = positionKeys[i];
            const dripPosition = await Accounts.DripPosition.fetch(
                this.connection,
                positionKey,
                this.programId
            );
            if (dripPosition) {
                if (
                    Date.now() >
                    dripPosition.dripActivationTimestamp * BigInt(1000)
                ) {
                    res.push(
                        new Position(
                            dripPosition,
                            await this.getPositionHandler(dripPosition)
                        )
                    );
                }
            }
            i += 1;
        }
        return res;
    }
}

export class Position implements IPosition {
    constructor(
        private readonly value: Accounts.DripPosition,
        private readonly handler: IDripHandler
    ) {}

    async drip(): Promise<string> {
        return this.handler.drip();
    }

    toJSON(): Accounts.DripPositionJSON {
        return this.value.toJSON();
    }
}
