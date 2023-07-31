import assert from 'assert';

import {
    DripPositionAccountJSON,
    DripPositionOwnerJSON,
} from '@dcaf/drip-types';
import { PublicKey } from '@solana/web3.js';
import { inject } from 'inversify';
import { Controller, Get, Path, Route } from 'tsoa';

import { IAccountRepository } from '../base/repository';
import { TYPES, provideSingleton } from '../ioCTypes';

import { GetWalletPositions } from './types';

@Route('/positions')
@provideSingleton(DripPositionController)
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
                        owner: p.owner_value,
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
                dripAmountPreFees: p.drip_amount_pre_fees.toString(),
                maxSlippageBps: 0,
                maxPriceDeviationBps: 0,
                dripFeeBps: 0,
                dripPositionNftMint: null,
                autoCreditEnabled: false,
                dripAmountRemainingPostFeesInCurrentCycle:
                    p.drip_amount_remaining_post_fees_in_current_cycle.toString(),
                dripInputFeesRemainingForCurrentCycle:
                    p.drip_input_fees_remaining_for_current_cycle.toString(),
                totalInputFeesCollected:
                    p.total_input_fees_collected.toString(),
                totalOutputFeesCollected:
                    p.total_output_fees_collected.toString(),
                totalInputTokenDrippedPostFees:
                    p.total_input_token_dripped_post_fees.toString(),
                totalOutputTokenReceivedPostFees:
                    p.total_output_token_received_post_fees.toString(),
                frequencyInSeconds: p.frequency_in_seconds.toString(),
                dripMaxJitter: p.drip_max_jitter,
                dripActivationGenesisShift:
                    p.drip_activation_genesis_shift.toString(),
                dripActivationTimestamp: Math.floor(
                    p.drip_activation_timestamp.getTime() / 1000
                ).toString(),
                cycle: p.cycle.toString(),
            };
            return apiPosition;
        });
        return {
            data: res,
        };
    }
}
