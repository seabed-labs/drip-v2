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
import { DripPDA } from '../utils';
import { Accounts, Instructions } from '@dcaf/drip-types';
import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddressSync,
} from '@solana/spl-token';

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
            dripFrequencyInSeconds,
            initialDeposit,
        } = params;
        const payer = payerOverride ?? owner;

        const pairConfigPubkey = DripPDA.derivePairConfig(
            this.globalConfig,
            inputMint,
            outputMint,
            this.programId
        );

        const pairConfigAccount = await Accounts.PairConfig.fetch(
            this.connection,
            pairConfigPubkey,
            this.programId
        );

        const instructions: TransactionInstruction[] = [];

        if (!pairConfigAccount) {
            const initPairConfigIx = new Instructions.InitPairConfig({
                args: null,
                accounts:{
                    payer,
                    globalConfig: this.globalConfig,
                    inputTokenMint: inputMint,
                    outputTokenMint: outputMint,
                    pairConfig: pairConfigPubkey,
                    systemProgram: SystemProgram.programId,
                },
            },
            );

            instructions.push(initPairConfigIx.build(this.programId));
        }

        const dripPositionSignerPubkey = DripPDA.deriveDripPositionSigner(
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

        const initDripPositionIx = new Instructions.InitDripPosition({
                args: {
                    params: {
                        owner,
                        dripAmount,
                        frequencyInSeconds: BigInt(dripFrequencyInSeconds),
                    }
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
            }
        );

        instructions.push(initDripPositionIx.build(this.programId));

        if (initialDeposit) {
            // TODO: Support wSOL

            const depositIx = new Instructions.Deposit({
              args: {
                  params: {
                      depositAmount: initialDeposit.amount,
                  }
              },
                accounts: {
                    signer: initialDeposit.depositor,
                    sourceInputTokenAccount:
                    initialDeposit.depositorTokenAccount,
                    dripPositionInputTokenAccount:
                    dripPositionInputTokenAccount,
                    dripPosition: dripPositionKeypair.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                }
            },
            );

            instructions.push(depositIx.build(this.programId));
        }

        return {
            instructions,
            signers: [dripPositionKeypair],
        };
    }
    getDepositTransaction(params: DepositParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getWithdrawTransaction(params: WithdrawParams): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
    getClosePositionTransaction(): Promise<Transaction> {
        throw new Error('Method not implemented.');
    }
}
