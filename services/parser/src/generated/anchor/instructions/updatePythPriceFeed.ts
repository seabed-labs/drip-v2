import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface UpdatePythPriceFeedAccounts {
    signer: PublicKey
    globalConfig: PublicKey
    pairConfig: PublicKey
    inputTokenPythPriceFeed: PublicKey
    outputTokenPythPriceFeed: PublicKey
}

export function updatePythPriceFeed(
    accounts: UpdatePythPriceFeedAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.signer, isSigner: true, isWritable: false },
        { pubkey: accounts.globalConfig, isSigner: false, isWritable: false },
        { pubkey: accounts.pairConfig, isSigner: false, isWritable: true },
        {
            pubkey: accounts.inputTokenPythPriceFeed,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: accounts.outputTokenPythPriceFeed,
            isSigner: false,
            isWritable: false,
        },
    ]
    const identifier = Buffer.from([143, 59, 241, 166, 49, 225, 12, 238])
    const data = identifier
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
