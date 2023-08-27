import { PublicKey } from '@solana/web3.js';
import { inject } from 'inversify';
import { Body, Controller, Post, Route, SuccessResponse, Response } from 'tsoa';

import { IAccountProcessor } from '../base/accountProcessor';
import { logger } from '../base/logger';
import { ITransactionProcessor } from '../base/transactionProcessor';
import { TYPES, provideSingleton } from '../ioCTypes';
import { getErrLog } from '../utils';

import {
    RestError,
    WebhookResponse,
    WebhookSubmitAccountsBody,
    WebhookSubmitTxsBody,
} from './types';

// TODO: Add api key verification
// TODO: Add queue so that our Api instance does not become
// overloaded / ddos'd
@Route('webhook')
@provideSingleton(WebhookController)
export class WebhookController extends Controller {
    constructor(
        @inject(TYPES.ITransactionProcessor)
        private readonly txProcessor: ITransactionProcessor,
        @inject(TYPES.IAccountProcessor)
        private readonly accountProcessor: IAccountProcessor
    ) {
        super();
    }

    @Response<RestError>(503)
    @SuccessResponse(201)
    @Post('/tx')
    public async submitTx(
        @Body() txs: WebhookSubmitTxsBody
    ): Promise<WebhookResponse> {
        const res: string[] = [];
        for (let i = 0; i < txs.length; i++) {
            try {
                if (!txs[i].transaction.signatures.length) {
                    logger.error('Received empty signatures!', txs[i]);
                    continue;
                }
                await this.txProcessor.upsertDripTransaction(
                    txs[i].transaction.signatures[0]
                );
                res.push(txs[i].transaction.signatures[0]);
            } catch (e) {
                logger.error('Failed to process transaction', {
                    ...getErrLog(e),
                    signature: txs[i].transaction.signatures[0],
                });
            }
        }
        logger.warn(`upserted ${res.length} of ${txs.length} transactions `);
        if (res.length !== txs.length) {
            logger.warn(
                `upserted ${res.length} transactions but expected ${txs.length}`
            );
            // error out so that helius can retry
            this.setStatus(503);
        } else {
            this.setStatus(201);
        }
        return {
            processed: res,
        };
    }

    @Response<RestError>(503)
    @SuccessResponse(201)
    @Post('/account')
    public async submitAccount(
        @Body() accounts: WebhookSubmitAccountsBody
    ): Promise<WebhookResponse> {
        const res: string[] = [];
        for (let i = 0; i < accounts.length; i++) {
            try {
                await this.accountProcessor.upsertAccountByAddress(
                    new PublicKey(accounts[i].account.parsed.pubkey)
                );
                res.push(accounts[i].account.parsed.pubkey);
            } catch (e) {
                logger.error('Failed to process account', {
                    ...getErrLog(e),
                    error: JSON.stringify(e),
                    account: accounts[i].account.parsed.pubkey,
                });
            }
        }
        logger.warn(`upserted ${res.length} of ${accounts.length} accounts `);
        if (res.length !== accounts.length) {
            logger.warn(
                `upserted ${res.length} accounts but expected ${accounts.length}`
            );
            // error out so that helius can retry
            this.setStatus(503);
        } else {
            this.setStatus(201);
        }
        return {
            processed: res,
        };
    }
}
