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

import { GetWalletPositionsResponse } from './types';

@Route('wallet')
@provideSingleton(DripPositionController)
export class DripPositionController extends Controller {
    constructor(
        @inject(TYPES.IAccountRepository)
        private readonly accountRepo: IAccountRepository
    ) {
        super();
    }
    @Get(`/{wallet}/positions/`)
    public async getDripPositionsForWallet(
        @Path('wallet') walletAddress: string
    ): Promise<GetWalletPositionsResponse> {
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
            if (p.ownerKind === 'Direct') {
                assert(p.ownerValue);
                owner = {
                    kind: p.ownerKind,
                    value: {
                        owner: p.ownerValue,
                    },
                };
            } else if (p.ownerKind === 'Tokenized') {
                owner = {
                    kind: p.ownerKind,
                };
            }
            assert(owner);
            const apiPosition: DripPositionAccountJSON = {
                ...p,
                owner,
                dripAmountPreFees: p.dripAmountPreFees.toString(),
                dripAmountRemainingPostFeesInCurrentCycle:
                    p.dripAmountRemainingPostFeesInCurrentCycle.toString(),
                dripInputFeesRemainingForCurrentCycle:
                    p.dripInputFeesRemainingForCurrentCycle.toString(),
                totalInputFeesCollected: p.totalInputFeesCollected.toString(),
                totalOutputFeesCollected: p.totalOutputFeesCollected.toString(),
                totalInputTokenDrippedPostFees:
                    p.totalInputTokenDrippedPostFees.toString(),
                totalOutputTokenReceivedPostFees:
                    p.totalOutputTokenReceivedPostFees.toString(),
                frequencyInSeconds: p.frequencyInSeconds.toString(),
                dripMaxJitter: p.dripMaxJitter,
                dripActivationGenesisShift:
                    p.dripActivationGenesisShift.toString(),
                dripActivationTimestamp: Math.floor(
                    p.dripActivationTimestamp.getTime() / 1000
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
