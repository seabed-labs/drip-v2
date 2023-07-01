import { Address, Provider } from '@coral-xyz/anchor';
import { Wallet } from '@coral-xyz/anchor/dist/cjs/provider';
import {
    CreatePositionParams,
    IDripClient,
    IDripPosition,
    IDripInstructionsFactory,
    TxResult,
} from '../types';
import {
    Commitment,
    Connection,
    Keypair,
    PublicKey,
    SendOptions,
    SerializeConfig,
    Signer,
    Transaction,
    TransactionSignature,
    VersionedTransaction,
} from '@solana/web3.js';
import { DripInstructionsFactory } from './DripInstructionsFactory';
import { DripPosition } from './DripPosition';

// TODOs:
// 1. Use versioned transactions

export class DripClient implements IDripClient {
    private constructor(
        public readonly programId: PublicKey,
        private readonly globalConfig: PublicKey,
        private readonly connection: Connection,
        private readonly signer: Signer | Provider | Wallet | null,
        public readonly instructionsFactory: IDripInstructionsFactory = new DripInstructionsFactory(
            programId,
            globalConfig,
            connection
        )
    ) {}

    public static withProvider(
        programId: PublicKey,
        globalConfig: PublicKey,
        provider: Provider
    ): IDripClient {
        if (provider.sendAndConfirm == undefined) {
            throw new Error(
                "Cannot initialize DripClient with a Provider that doesn't have sendAndConfirm()"
            );
        }

        return new DripClient(
            programId,
            globalConfig,
            provider.connection,
            provider
        );
    }

    public static withSigner(
        programId: PublicKey,
        globalConfig: PublicKey,
        connection: Connection,
        signer: Signer
    ): IDripClient {
        return new DripClient(programId, globalConfig, connection, signer);
    }

    public static withWallet(
        programId: PublicKey,
        globalConfig: PublicKey,
        connection: Connection,
        wallet: Wallet
    ): IDripClient {
        return new DripClient(programId, globalConfig, connection, wallet);
    }

    public static readonly(
        programId: PublicKey,
        globalConfig: PublicKey,
        connection: Connection
    ): IDripClient {
        return new DripClient(programId, globalConfig, connection, null);
    }

    // TODO: Move this to utils
    private static signerIsWallet(
        signer: DripClient['signer']
    ): signer is Wallet {
        return (signer as Wallet | undefined)?.signTransaction !== undefined;
    }

    // TODO: Move this to utils
    private static signerIsProvider(
        signer: DripClient['signer']
    ): signer is Provider {
        return (signer as Provider | undefined)?.sendAndConfirm !== undefined;
    }

    private static txIsVersioned(
        tx: Transaction | VersionedTransaction
    ): tx is VersionedTransaction {
        return (tx as VersionedTransaction | undefined)?.version !== undefined;
    }

    private async signAndSendTx(
        tx: Transaction | VersionedTransaction,
        additionalSigners: Signer[] = [],
        feePayerOverride?: Signer,
        commitment: Commitment = 'confirmed',
        sendOptions: SendOptions = {
            // TODO: arbitrary, should probably make this configurable or something
            maxRetries: 3,
        },
        serializeConfig: SerializeConfig = {}
    ): Promise<TransactionSignature> {
        const signer = feePayerOverride ?? this.signer;

        if (DripClient.signerIsProvider(signer)) {
            if (signer.sendAndConfirm) {
                return await signer.sendAndConfirm(tx, additionalSigners, {
                    ...sendOptions,
                    commitment,
                });
            }

            // TODO: Improve DevX
            throw new Error(
                "DripClient's signer is a Provider without sendAndConfirm()"
            );
        }

        let signedTx: typeof tx;
        if (DripClient.signerIsWallet(signer)) {
            signedTx = await signer.signTransaction(tx);
        } else if (signer) {
            if (DripClient.txIsVersioned(tx)) {
                tx.sign([signer]);
            } else {
                tx.sign(signer);
            }
            signedTx = tx;
        } else {
            // TODO: Improve DevX
            throw new Error('DripClient is readonly');
        }

        if (additionalSigners.length > 0) {
            if (DripClient.txIsVersioned(signedTx)) {
                signedTx.sign(additionalSigners);
            } else {
                signedTx.sign(...additionalSigners);
            }
        }

        const txSig = await this.connection.sendRawTransaction(
            signedTx.serialize(serializeConfig),
            sendOptions
        );
        const blockhash = await this.connection.getLatestBlockhash('finalized');
        const res = await this.connection.confirmTransaction(
            { signature: txSig, ...blockhash },
            commitment
        );

        if (res.value.err) {
            // TODO: Improve DevX
            throw res.value.err;
        }

        return txSig;
    }

    async createPosition(
        params: CreatePositionParams
    ): Promise<TxResult<IDripPosition>> {
        const { signers, ...otherParams } = params;

        const dripPositionKeypair = Keypair.generate();

        const { instructions, signers: otherSigners } =
            await this.instructionsFactory.getCreatePositionTransaction(
                otherParams,
                dripPositionKeypair
            );

        // TODO: Abstract the Transaction creation logic since it'll be duplicated in each entrypoint here
        const latestBlockhash = await this.connection.getLatestBlockhash(
            'finalized'
        );
        const tx = new Transaction(latestBlockhash);
        tx.add(...instructions);

        const txSig = await this.signAndSendTx(tx, [
            ...(signers ?? []),
            ...otherSigners,
        ]);

        return {
            txSignature: txSig,
            value: new DripPosition(dripPositionKeypair.publicKey),
        };
    }

    getPosition(positionPubkey: Address): Promise<IDripPosition | null> {
        throw new Error('Method not implemented.');
    }

    getPositionByNft(
        positionNftMintPubkey: Address
    ): Promise<IDripPosition | null> {
        throw new Error('Method not implemented.');
    }
}
