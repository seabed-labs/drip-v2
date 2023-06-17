import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
// eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface TokenizeDripPositionAccounts {
    payer: PublicKey
    owner: PublicKey
    dripPosition: PublicKey
    dripPositionSigner: PublicKey
    dripPositionNftMint: PublicKey
    dripPositionNftAccount: PublicKey
    dripPositionNftMapping: PublicKey
    systemProgram: PublicKey
    tokenProgram: PublicKey
    associatedTokenProgram: PublicKey
}

export function tokenizeDripPosition(
    accounts: TokenizeDripPositionAccounts,
    programId: PublicKey = PROGRAM_ID
) {
    const keys: Array<AccountMeta> = [
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.owner, isSigner: true, isWritable: false },
        { pubkey: accounts.dripPosition, isSigner: false, isWritable: true },
        {
            pubkey: accounts.dripPositionSigner,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: accounts.dripPositionNftMint,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionNftAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.dripPositionNftMapping,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        {
            pubkey: accounts.associatedTokenProgram,
            isSigner: false,
            isWritable: false,
        },
    ]
    const identifier = Buffer.from([96, 214, 241, 27, 250, 106, 218, 233])
    const data = identifier
    const ix = new TransactionInstruction({ keys, programId, data })
    return ix
}
