import { AccountInfo, PublicKey, Connection as Web3Conn } from '@solana/web3.js'
import { Address, translateAddress } from '@coral-xyz/anchor'
import assert from 'assert'
import { PROGRAM_ID } from '@dcaf/drip-types'

export class InvalidOwnerError extends Error {
    constructor(account: string, owner: string, expectedOwner: string) {
        super(
            `account ${account} was expected to be owned by ${expectedOwner} but it is owned by ${owner}`
        )
    }
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
        owner: PublicKey = PROGRAM_ID
    ): Promise<AccountInfo<Buffer>> {
        const accountInfo = await this.getAccountInfo(translateAddress(address))
        assert(
            accountInfo,
            `account ${address.toString()} was null or not found`
        )
        if (accountInfo.owner.toString() !== owner.toString()) {
            throw new InvalidOwnerError(
                address.toString(),
                accountInfo.owner.toString(),
                owner.toString()
            )
        }
        return accountInfo
    }
}
