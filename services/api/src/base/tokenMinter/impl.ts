import { mintTo } from '@solana/spl-token';
import { Keypair, PublicKey } from '@solana/web3.js';
import { inject, injectable } from 'inversify';

import { TYPES } from '../../ioCTypes';
import { Environment, IConfig } from '../config';
import { logger } from '../logger';
import { IConnection } from '../rpcConnection';

import { ITokenMinter } from './types';

@injectable()
export class TestTokenMinter implements ITokenMinter {
    private readonly tokenMintAuthority: Keypair;

    constructor(
        @inject(TYPES.IConnection) private readonly connection: IConnection,
        @inject(TYPES.IConfig) config: IConfig
    ) {
        const authority = config.tokenMintAuthority;
        if (config.environment === Environment.production || !authority) {
            logger.error('could not initialize TestTokenMinter', {
                isKeypairSet: authority !== undefined,
                environment: config.environment,
            });
            throw new Error('could not initialize TestTokenMinter');
        }
        this.tokenMintAuthority = authority;
    }

    mintTo(
        tokenMint: PublicKey,
        to: PublicKey,
        amount: bigint
    ): Promise<string> {
        return mintTo(
            this.connection,
            this.tokenMintAuthority,
            tokenMint,
            to,
            this.tokenMintAuthority.publicKey,
            amount
        );
    }
}
