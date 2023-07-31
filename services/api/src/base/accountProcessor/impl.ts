import { PublicKey } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { IAccountRepository } from '../repository';

import { IAccountProcessor } from './types';

@injectable()
export class AccountProcessor implements IAccountProcessor {
    constructor(
        @inject(TYPES.IAccountRepository)
        private readonly accountRepo: IAccountRepository
    ) {}

    upsertDripAccount(address: PublicKey): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
