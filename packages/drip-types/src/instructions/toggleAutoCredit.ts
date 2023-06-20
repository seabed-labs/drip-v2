// This file was automatically generated. DO NOT MODIFY DIRECTLY.
import { TransactionInstruction, PublicKey, AccountMeta } from '@solana/web3.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from 'bn.js' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from '@coral-xyz/borsh' // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from '../types' // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from '../programId'

export interface ToggleAutoCreditAccounts {
    signer: PublicKey
    dripPosition: PublicKey
}

export interface ToggleAutoCreditAccountsJSON {
    signer: string
    dripPosition: string
}

export class ToggleAutoCredit {
    static readonly ixName = 'toggleAutoCredit'
    readonly identifier: Buffer
    readonly keys: Array<AccountMeta>

    constructor(
        readonly accounts: ToggleAutoCreditAccounts,
        readonly programId: PublicKey = PROGRAM_ID
    ) {
        this.identifier = Buffer.from([175, 234, 245, 131, 133, 109, 187, 74])
        this.keys = [
            { pubkey: this.accounts.signer, isSigner: true, isWritable: false },
            {
                pubkey: this.accounts.dripPosition,
                isSigner: false,
                isWritable: true,
            },
        ]
    }

    static fromDecoded(flattenedAccounts: PublicKey[]) {
        const accounts = {
            signer: flattenedAccounts[0],
            dripPosition: flattenedAccounts[1],
        }
        return new ToggleAutoCredit(accounts)
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

    toAccountsJSON(): ToggleAutoCreditAccountsJSON {
        return {
            signer: this.accounts.signer.toString(),
            dripPosition: this.accounts.dripPosition.toString(),
        }
    }
}
