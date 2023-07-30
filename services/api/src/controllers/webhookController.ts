import { inject } from 'inversify';
import { Body, Controller, Post, Route, SuccessResponse, Response } from 'tsoa';

import { IAccountProcessor } from '../base/accountProcessor';
import { ILogger } from '../base/logger';
import { ITransactionProcessor } from '../base/transactionProcessor';
import { TYPES } from '../ioCTypes';

import { RestError, WebhookResponse, WebhookSubmitTxsBody } from './types';

@Route('webhook')
export class WebhookController extends Controller {
    constructor(
        @inject(TYPES.ILogger) private readonly logger: ILogger,
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
                if (!txs[i].signatures.length) {
                    this.logger.data(txs[i]).warn('Received empty signatures!');
                    continue;
                }
                await this.txProcessor.upsertDripTransaction(
                    txs[i].signatures[0]
                );
            } catch (e) {
                this.logger
                    .data({
                        error: e,
                        signature: txs[i].signatures[0],
                    })
                    .error('Failed to process transaction');
            }
        }
        // error out so that helius can retry
        if (res.length !== txs.length) {
            this.setStatus(503);
        } else {
            this.setStatus(201);
        }
        return {
            processed: res,
        };
    }

    @Post('/account')
    public async submitAccount(): Promise<WebhookResponse> {
        this.setStatus(503);
        return {
            processed: [],
        };
    }
}
