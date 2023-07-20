import {
    AccountInfo,
    Commitment,
    Finality,
    PublicKey,
    VersionedTransactionResponse,
    Connection as Web3Conn,
} from '@solana/web3.js';
import { Address, translateAddress } from '@coral-xyz/anchor';
import { RestError } from './types';
import { getErrMessage } from './common';
import { rpcUrl } from './env';

const MAX_SUPPORTED_TRANSACTION_VERSION = 0;

export class Connection extends Web3Conn {
    private readonly rpcUrl: string;
    constructor() {
        super(rpcUrl, 'finalized');
        this.rpcUrl = rpcUrl;
    }

    async getNonNullableAccountInfo(
        address: Address,
        commitment: Commitment = 'finalized',
        owner: PublicKey
    ): Promise<AccountInfo<Buffer>> {
        let accountInfo: AccountInfo<Buffer> | null;
        try {
            accountInfo = await this.getAccountInfo(
                translateAddress(address),
                commitment
            );
        } catch (e) {
            throw RestError.invalid(getErrMessage(e));
        }
        if (!accountInfo) {
            throw RestError.notFound(`account ${address.toString()} not found`);
        }
        if (accountInfo.owner.toString() !== owner.toString()) {
            throw RestError.invalid(
                `account ${address.toString()} was expected to be owned by ${accountInfo.owner.toString()} but it is owned by ${owner.toString()}`
            );
        }
        return accountInfo;
    }

    async getNonNullableTransaction(
        signature: string,
        commitment: Finality = 'finalized'
    ): Promise<VersionedTransactionResponse> {
        let tx: VersionedTransactionResponse | null;
        try {
            tx = await this.getTransaction(signature, {
                commitment,
                maxSupportedTransactionVersion:
                    MAX_SUPPORTED_TRANSACTION_VERSION,
            });
        } catch (e) {
            console.error(e);
            throw RestError.invalid(getErrMessage(e));
        }
        if (!tx) {
            throw RestError.notFound(
                `signature ${signature.toString()} not found`
            );
        }
        return tx;
    }
}
