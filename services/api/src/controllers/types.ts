import { DripPositionAccountJSON } from '@dcaf/drip-types';

import { TokenMintMetadata } from '../base/tokenList';

export class RestError extends Error {
    constructor(readonly status: number, readonly message: string) {
        super(`${status}: ${message ?? ''}`);
    }

    static invalid(message: string): RestError {
        return new RestError(400, message);
    }

    static notFound(message: string): RestError {
        return new RestError(404, message);
    }

    static unprocessable(message: string): RestError {
        return new RestError(422, message);
    }

    static internal(message: string): RestError {
        return new RestError(500, message);
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
        };
    }
}

export type Response<T> =
    | {
          data: T;
      }
    | {
          error: string;
          details?: string;
      };
////////////////////////////////////////////////////////////////////////
// Request Responses
////////////////////////////////////////////////////////////////////////

export type PingResponse = {
    message: string;
};

export type WebhookResponse = {
    processed: string[];
};

export type GetWalletPositionsResponse = Response<DripPositionAccountJSON[]>;

export type GetTokenListResponse = Response<TokenMintMetadata[]>;

export type GetTokenResponse = Response<TokenMintMetadata>;

export type MintTestTokenBody = {
    amount: string;
    to: string;
};

export type MintTestToken = Response<string>;
////////////////////////////////////////////////////////////////////////
// Request Bodies
////////////////////////////////////////////////////////////////////////

export type SubmitTx = {
    transaction: {
        signatures: string[];
    };
};

export type WebhookSubmitTxsBody = SubmitTx[];

export type SubmitAccount = {
    account: {
        parsed: {
            pubkey: string;
        };
    };
};

export type WebhookSubmitAccountsBody = SubmitAccount[];
