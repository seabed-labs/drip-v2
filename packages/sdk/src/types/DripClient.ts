import { Address } from '@coral-xyz/anchor';
import { IDripPosition } from './DripPosition';
import { IDripInstructionsFactory } from './DripTxFactory';
import { TxResult } from './TxResult';
import { CreatePositionParams } from './params';
import { PublicKey } from '@solana/web3.js';

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
