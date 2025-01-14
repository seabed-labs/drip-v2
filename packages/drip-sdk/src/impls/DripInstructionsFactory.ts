import {
    Deposit,
    InitDripPosition,
    InitPairConfig,
    PairConfig,
} from '@dcaf/drip-types';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';
import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import {
    CreatePositionParams,
    DepositParams,
    DripInstructions,
    IDripInstructionsFactory,
    WithdrawParams,
} from '../types';
import { derivePairConfig, deriveDripPositionSigner } from '../utils';

export class DripInstructionsFactory implements IDripInstructionsFactory {
    public constructor(
        public readonly programId: PublicKey,
        public readonly globalConfig: PublicKey,
        private readonly connection: Connection
    ) {}

    async getCreatePositionTransaction(
        params: Omit<CreatePositionParams, 'signers'>,
        dripPositionKeypair = Keypair.generate()
    ): Promise<DripInstructions> {
        const {
            owner,
            inputMint,
            outputMint,
            payer: payerOverride,
            dripAmount,
            frequencyInSeconds,
            maxSlippageBps,
            maxPriceDeviationBps,
            initialDeposit,
        } = params;
        const payer = payerOverride ?? owner;

        const pairConfigPubkey = derivePairConfig(
            this.globalConfig,
            inputMint,
            outputMint,
            this.programId
        );

        const pairConfigAccount = await PairConfig.fetch(
            this.connection,
            pairConfigPubkey,
            this.programId
        );

        const instructions: TransactionInstruction[] = [];

        if (!pairConfigAccount) {
            const initPairConfigIx = new InitPairConfig(this.programId, {
                args: null,
                accounts: {
                    payer,
                    globalConfig: this.globalConfig,
                    inputTokenMint: inputMint,
                    outputTokenMint: outputMint,
                    pairConfig: pairConfigPubkey,
                    systemProgram: SystemProgram.programId,
                },
            });

            instructions.push(initPairConfigIx.build());
        }

        const dripPositionSignerPubkey = deriveDripPositionSigner(
            dripPositionKeypair.publicKey,
            this.programId
        );

        const [dripPositionInputTokenAccount, dripPositionOutputTokenAccount] =
            [inputMint, outputMint].map((mint) =>
                getAssociatedTokenAddressSync(
                    mint,
                    dripPositionSignerPubkey,
                    true,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );

        const initDripPositionIx = new InitDripPosition(this.programId, {
            args: {
                params: {
                    owner,
                    dripAmount,
                    frequencyInSeconds: BigInt(frequencyInSeconds),
                    maxSlippageBps: maxSlippageBps,
                    maxPriceDeviationBps: maxPriceDeviationBps,
                },
            },
            accounts: {
                payer,
                globalConfig: this.globalConfig,
                pairConfig: pairConfigPubkey,
                inputTokenMint: inputMint,
                outputTokenMint: outputMint,
                inputTokenAccount: dripPositionInputTokenAccount,
                outputTokenAccount: dripPositionOutputTokenAccount,
                dripPosition: dripPositionKeypair.publicKey,
                dripPositionSigner: dripPositionSignerPubkey,
                systemProgram: SystemProgram.programId,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            },
        });

        instructions.push(initDripPositionIx.build());

        if (initialDeposit) {
            // TODO: Support wSOL

            const depositIx = new Deposit(this.programId, {
                args: {
                    params: {
                        depositAmount: initialDeposit.amount,
                    },
                },
                accounts: {
                    signer: initialDeposit.depositor,
                    sourceInputTokenAccount:
                        initialDeposit.depositorTokenAccount,
                    dripPositionInputTokenAccount:
                        dripPositionInputTokenAccount,
                    dripPosition: dripPositionKeypair.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
            });

            instructions.push(depositIx.build());
        }

        return {
            instructions,
            signers: [dripPositionKeypair],
        };
    }
    getDepositTransaction(_params: DepositParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getWithdrawTransaction(_params: WithdrawParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getClosePositionTransaction(): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
}
