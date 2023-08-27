import {
    VersionedTransactionResponse,
    MessageAccountKeys,
    MessageCompiledInstruction,
} from '@solana/web3.js';

export interface IInstructionProcessor {
    upsertInstruction(
        tx: VersionedTransactionResponse,
        accountKeys: MessageAccountKeys,
        ix: MessageCompiledInstruction
    ): Promise<void>;
}
