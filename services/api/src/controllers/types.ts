import { DripPositionAccountJSON } from '@dcaf/drip-types';

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

export type GetWalletPositions = Response<DripPositionAccountJSON[]>;

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
