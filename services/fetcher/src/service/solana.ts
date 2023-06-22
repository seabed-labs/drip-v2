import {
    AccountInfo,
    Commitment,
    Finality,
    PublicKey,
    VersionedTransactionResponse,
    Connection as Web3Conn,
} from '@solana/web3.js'
import { Address, translateAddress } from '@coral-xyz/anchor'
import { PROGRAM_ID } from '@dcaf/drip-types'
import { RestError } from './types'

const MAX_SUPPORTED_TRANSACTION_VERSION = 0

function getInvalidOwnerError(
    account: string,
    owner: string,
    expectedOwner: string
): RestError {
    return RestError.invalid(
        `account ${account} was expected to be owned by ${expectedOwner} but it is owned by ${owner}`
    )
}

export class Connection extends Web3Conn {
    private readonly rpcUrl: string
    constructor() {
        const rpcUrl =
            process.env.fetcher_RPC_URL ||
            'https://quick-dark-dust.solana-mainnet.discover.quiknode.pro/67c6e7fd9430ec7c3cf355ce177b058d653a416e'
        super(rpcUrl, 'finalized')
        this.rpcUrl = rpcUrl
    }

    async getNonNullableAccountInfo(
        address: Address,
        commitment: Commitment = 'finalized',
        owner: PublicKey = PROGRAM_ID
    ): Promise<AccountInfo<Buffer>> {
        const accountInfo = await this.getAccountInfo(
            translateAddress(address),
            commitment
        )
        if (!accountInfo) {
            throw RestError.notFound(`account ${address.toString()} not found`)
        }
        if (accountInfo.owner.toString() !== owner.toString()) {
            throw getInvalidOwnerError(
                address.toString(),
                accountInfo.owner.toString(),
                owner.toString()
            )
        }
        return accountInfo
    }

    async getNonNullableTransaction(
        signature: string,
        commitment: Finality = 'finalized'
    ): Promise<VersionedTransactionResponse> {
        const tx = await this.getTransaction(signature, {
            commitment,
            maxSupportedTransactionVersion: MAX_SUPPORTED_TRANSACTION_VERSION,
        })
        if (!tx) {
            throw RestError.notFound(
                `signature ${signature.toString()} not found`
            )
        }
        return tx
    }
}
