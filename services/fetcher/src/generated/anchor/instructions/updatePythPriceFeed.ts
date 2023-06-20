// This file was automatically generated. DO NOT MODIFY DIRECTLY.
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

export interface UpdatePythPriceFeedAccountsJSON {
    signer: string
    globalConfig: string
    pairConfig: string
    inputTokenPythPriceFeed: string
    outputTokenPythPriceFeed: string
}

export class UpdatePythPriceFeed {
    static readonly ixName = 'updatePythPriceFeed'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>

    constructor(
        readonly accounts: UpdatePythPriceFeedAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([143, 59, 241, 166, 49, 225, 12, 238])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.globalConfig,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.pairConfig,
                isSigner: false,
                isWritable: true,
            },
            {
                pubkey: this.accounts.inputTokenPythPriceFeed,
                isSigner: false,
                isWritable: false,
            },
            {
                pubkey: this.accounts.outputTokenPythPriceFeed,
                isSigner: false,
                isWritable: false,
            },
        ]
    }

    static fromDecoded(flattenedAccounts: PublicKey[]) {
        const accounts = {
            signer: flattenedAccounts[0],
            globalConfig: flattenedAccounts[1],
            pairConfig: flattenedAccounts[2],
            inputTokenPythPriceFeed: flattenedAccounts[3],
            outputTokenPythPriceFeed: flattenedAccounts[4],
        }
        return new UpdatePythPriceFeed(accounts)
    }

    build() {
        const data = this.identifier
        const ix = new TransactionInstruction({
            keys: this.keys,
            programId: this.programId,
            data,
        })
        return ix
    }

    toAccountsJSON(): UpdatePythPriceFeedAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            globalConfig: this.accounts.globalConfig.toString(),
            pairConfig: this.accounts.pairConfig.toString(),
            inputTokenPythPriceFeed:
                this.accounts.inputTokenPythPriceFeed.toString(),
            outputTokenPythPriceFeed:
                this.accounts.outputTokenPythPriceFeed.toString(),
        }
    }
}
