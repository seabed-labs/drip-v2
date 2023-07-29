import { Address } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

import { IDripPosition } from './DripPosition';
import { IDripInstructionsFactory } from './DripTxFactory';
import { TxResult } from './TxResult';
import { CreatePositionParams } from './params';

export interface IDripClient {
    programId: PublicKey;
    instructionsFactory: IDripInstructionsFactory;

    createPosition(
        params: CreatePositionParams
    ): Promise<TxResult<IDripPosition>>;

    getPosition(positionPubkey: Address): Promise<IDripPosition | null>;
    getPositionByNft(
        positionNftMintPubkey: Address
    ): Promise<IDripPosition | null>;
}
