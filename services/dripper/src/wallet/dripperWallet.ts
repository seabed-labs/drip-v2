import { Wallet as AnchorWallet } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { IDripperWallet } from './index';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';

const SOLANA_BIP_44_ROOT_PATH = `m/44'/501'`;

export class DripperWallet extends AnchorWallet implements IDripperWallet {
    private readonly mnemonicSeed: Buffer;
    private readonly rootPath: string;

    constructor(mnemonic: string) {
        const mnemonicSeed = mnemonicToSeedSync(mnemonic);
        const derivedSeed = derivePath(
            SOLANA_BIP_44_ROOT_PATH,
            mnemonicSeed.toString('hex')
        ).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const key = Keypair.fromSecretKey(secret);

        super(key);

        this.mnemonicSeed = mnemonicSeed;
        this.rootPath = SOLANA_BIP_44_ROOT_PATH;
        console.log(`dripper wallet ${key.publicKey.toString()}`);
    }

    /**
     * Derives a deterministic keypair, derived from the dripper wallet for a specific position's drip
     * This keypair is meant to provide a deterministic account to perform state changing operations during a drip
     * Example:
     * - transferring position drip amount to the deribved position drip wallet
     * - swapping from the derived position drip wallet
     * - draining input and output tokens from the derived drip wallet
     * In this way, the same dripper keypair can be used for n number of position and position drips without
     * retaining any dust/leftover state
     * @param position - the position address
     * @param cycle - the position cycle
     */
    getPathForPosition(position: PublicKey, cycle: bigint): string {
        const cycleBytes = new DataView(new ArrayBuffer(8));
        cycleBytes.setBigUint64(0, cycle, false);

        const positionPubKeyBytes = position.toBytes();

        const childPath = `/${positionPubKeyBytes.slice(
            0,
            4
        )}'/${positionPubKeyBytes.slice(4, 8)}'/${positionPubKeyBytes.slice(
            8,
            12
        )}'/${positionPubKeyBytes.slice(12, 16)}'/${positionPubKeyBytes.slice(
            16,
            20
        )}'/${positionPubKeyBytes.slice(20, 24)}'/${positionPubKeyBytes.slice(
            24,
            28
        )}'/${positionPubKeyBytes.slice(28, 32)}'/${cycleBytes.buffer.slice(
            0,
            4
        )}'/${cycleBytes.buffer.slice(4, 8)}'`;

        return `${this.rootPath}${childPath}`;
    }

    derivePositionKeyPair(position: PublicKey, cycle: bigint): Keypair {
        const path = this.getPathForPosition(position, cycle);
        const derivedSeed = derivePath(
            path,
            this.mnemonicSeed.toString('hex')
        ).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        return Keypair.fromSecretKey(secret);
    }
}
