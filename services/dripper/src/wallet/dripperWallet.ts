import { Wallet as AnchorWallet } from '@coral-xyz/anchor';
import { Keypair, PublicKey } from '@solana/web3.js';
import { IDripperWallet } from './index';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';

export class DripperWallet extends AnchorWallet implements IDripperWallet {
    private readonly mnemonicSeed: Buffer;
    private readonly rootPath: string;

    constructor(
        mnemonic: string,
    ) {
        // bip44: solana root
        const rootPath = `m/44'/501'`;
        const mnemonicSeed = mnemonicToSeedSync(mnemonic);
        const derivedSeed = derivePath(
            rootPath,
            mnemonicSeed.toString('hex')
        ).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const key = Keypair.fromSecretKey(secret);

        super(key);

        this.mnemonicSeed = mnemonicSeed;
        this.rootPath = rootPath;
        console.log(`dripper wallet ${key.publicKey.toString()}`);
    }

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
        const path = this.getPathForPosition(position, cycle)
        const derivedSeed = derivePath(
            path,
            this.mnemonicSeed.toString('hex')
        ).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        return Keypair.fromSecretKey(secret);
    }
}
