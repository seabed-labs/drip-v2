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
import { RpcNotFoundError, InvalidOwnerError } from './types'

const MAX_SUPPORTED_TRANSACTION_VERSION = 0
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
            throw new RpcNotFoundError(address.toString())
        }
        if (accountInfo.owner.toString() !== owner.toString()) {
            throw new InvalidOwnerError(
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
            throw new RpcNotFoundError(signature)
        }
        return tx
    }
}
