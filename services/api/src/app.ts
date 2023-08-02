import express, {
    json,
    urlencoded,
    Response as ExpressResponse,
    Request as ExpressRequest,
    NextFunction,
} from 'express';
import { ValidateError } from 'tsoa';

import { logger } from './base/logger';
import { RestError } from './controllers/types';
import { RegisterRoutes } from './generated/api';
import { getErrLog } from './utils';

export const app = express();

app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

RegisterRoutes(app);

app.use(function notFoundHandler(req: ExpressRequest, res: ExpressResponse) {
    res.status(404).send({
        error: `Not Found. No handler registered for ${req.path}`,
    });
});

app.use(function errorHandler(
    err: unknown,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
): ExpressResponse | void {
    if (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errObj: Record<string, any> = {
            ...getErrLog(err),
            path: req.path,
        };
        if (err instanceof ValidateError) {
            errObj.fields = err.fields;
            logger.error('uncaught server error', errObj);
            return res.status(422).json({
                error: 'Validation Failed',
                details: err?.fields,
            });
        }
        if (err instanceof RestError) {
            logger.error('uncaught server error', errObj);
            res.status(err.status).send({
                error: err.message,
                details: err.toJSON(),
            });
        } else {
            logger.error('uncaught server error', errObj);
            res.status(500).send({
                error: JSON.stringify(err),
            });
        }
    } else if (res.statusCode >= 400) {
        logger.error('returning error', { statusCode: res.statusCode });
    }
    next();
});
