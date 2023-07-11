import { Wallet } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
export interface IDripperWallet extends Wallet {
    derivePositionKeyPair(position: PublicKey, cycle: bigint): Keypair;
}
