import { Wallet as AnchorWallet } from '@coral-xyz/anchor';
// import { dripperKeypair } from '../env';
import { Keypair, PublicKey } from '@solana/web3.js';
import { IDripperWallet } from './index';
import { HDKey } from 'micro-ed25519-hdkey/index';
import { mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import nacl from 'tweetnacl';

export class DripperWallet extends AnchorWallet implements IDripperWallet {
    private readonly seed: Buffer;
    private readonly rootPath: string;
    constructor(
        mnemonic: string,
        rootPath?: string
        // private readonly keypair: Keypair
    ) {
        rootPath = rootPath ?? `m/44'/501'`;
        const mnemonicSeed = mnemonicToSeedSync(mnemonic);
        const derivedSeed = derivePath(
            rootPath,
            mnemonicSeed.toString('hex')
        ).key;
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
        const key = Keypair.fromSecretKey(secret);

        super(key);

        this.seed = mnemonicSeed;
        this.rootPath = rootPath;
        console.log(`dripper wallet ${key.publicKey.toString()}`);
    }

    derivePositionKeyPair(position: PublicKey, cycle: bigint): Keypair {
        const hd = HDKey.fromMasterSeed(this.seed.toString('hex'));

        const positionPubKeyBytes = position.toBytes();
        if (positionPubKeyBytes.length !== 32) {
            throw new Error(
                `Expected position ${position} to have 32 bytes but instead got ${positionPubKeyBytes.length}`
            );
        }
        const buf = new ArrayBuffer(8);
        const cycleView = new DataView(buf);
        cycleView.setBigUint64(0, cycle, false);

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
        )}'/${positionPubKeyBytes.slice(28, 32)}'/${cycleView.buffer.slice(
            0,
            4
        )}'/${cycleView.buffer.slice(4, 8)}'`;
        // should look something like this:  `m/44'/501'/${chunk1}'/.../${chunk10}'/0'`;
        const path = `${this.rootPath}${childPath}`;
        return Keypair.fromSeed(hd.derive(path).privateKey);
    }
}
