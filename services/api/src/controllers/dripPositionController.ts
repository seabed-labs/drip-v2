import assert from 'assert';

import {
    DripPositionAccountJSON,
    DripPositionOwnerJSON,
} from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';
import { inject } from 'inversify';
import { Controller, Get, Path, Route } from 'tsoa';

import { IAccountRepository } from '../base/repository';
import { TYPES } from '../ioCTypes';

import { GetWalletPositions } from './types';

@Route('/positions')
export class DripPositionController extends Controller {
    constructor(
        @inject(TYPES.IAccountRepository)
        private readonly accountRepo: IAccountRepository
    ) {
        super();
    }
    @Get(`/{wallet}`)
    public async getDripPositionsForWallet(
        @Path('wallet') walletAddress: string
    ): Promise<GetWalletPositions> {
        if (!PublicKey.isOnCurve(walletAddress)) {
            this.setStatus(400);
            return {
                error: `address ${walletAddress} is not a valid ed25519 public key.`,
            };
        }
        const positions = await this.accountRepo.getDripPositionsForWallet(
            walletAddress
        );
        const res = positions.map((p) => {
            let owner: DripPositionOwnerJSON | undefined = undefined;
            if (p.owner_kind === 'Direct') {
                assert(p.owner_value);
                owner = {
                    kind: p.owner_kind,
                    value: {
                        owner: p.owner_value!,
                    },
                };
            } else if (p.owner_kind === 'Tokenized') {
                owner = {
                    kind: p.owner_kind,
                };
            }
            assert(owner);
            const apiPosition: DripPositionAccountJSON = {
                globalConfig: p.global_config,
                pairConfig: p.pair_config,
                inputTokenAccount: p.input_token_account,
                outputTokenAccount: p.output_token_account,
                owner,
                // https://github.com/jawj/zapatos/issues/95 zapatos won't work :((
                // TODO: dripAmount is being parsed as a number instead of a bigint!!!
                dripAmountPreFees: p.drip_amount_pre_fees.toString(),
                maxSlippageBps: 0,
                maxPriceDeviationBps: 0,
                dripFeeBps: 0,
                dripPositionNftMint: null,
                autoCreditEnabled: false,
                dripAmountRemainingPostFeesInCurrentCycle: '',
                dripInputFeesRemainingForCurrentCycle: '',
                totalInputFeesCollected: '',
                totalOutputFeesCollected: '',
                totalInputTokenDrippedPostFees: '',
                totalOutputTokenReceivedPostFees: '',
                frequencyInSeconds: '',
                dripMaxJitter: 0,
                dripActivationGenesisShift: '',
                dripActivationTimestamp: '',
                cycle: '',
            };
            return apiPosition;
        });
        return {
            data: res,
        };
    }
}
