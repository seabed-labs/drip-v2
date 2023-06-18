import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface InitPairConfigAccounts {
    payer: PublicKey
    globalConfig: PublicKey
    inputTokenMint: PublicKey
    outputTokenMint: PublicKey
    pairConfig: PublicKey
    systemProgram: PublicKey
}

export function initPairConfig(
    accounts: InitPairConfigAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.inputTokenMint, isSigner: false, isWritable: false },
        {
            pubkey: accounts.outputTokenMint,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.pairConfig, isSigner: false, isWritable: true },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ]
    const identifier = Buffer.from([205, 58, 197, 248, 181, 39, 56, 152])
    const data = identifier
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
