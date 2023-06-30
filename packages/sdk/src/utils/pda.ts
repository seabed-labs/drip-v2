import { PublicKey } from '@solana/web3.js';

export function derivePairConfig(
    globalConfig: PublicKey,
    inputMint: PublicKey,
    outputMint: PublicKey,
    programId: PublicKey
): PublicKey {
    const [pdaPubkey] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('drip-v2-pair-config'),
            globalConfig.toBuffer(),
            inputMint.toBuffer(),
            outputMint.toBuffer(),
        ],
        programId
    );

    return pdaPubkey;
}

export function deriveDripPositionSigner(
    dripPosition: PublicKey,
    programId: PublicKey
): PublicKey {
    const [pdaPubkey] = PublicKey.findProgramAddressSync(
        [Buffer.from('drip-v2-drip-position-signer'), dripPosition.toBuffer()],
        programId
    );

    return pdaPubkey;
}

export function deriveGlobalConfigSigner(
    globalConfig: PublicKey,
    programId: PublicKey
): PublicKey {
    const [pdaPubkey] = PublicKey.findProgramAddressSync(
        [Buffer.from('drip-v2-global-signer'), globalConfig.toBuffer()],
        programId
    );

    return pdaPubkey;
}
