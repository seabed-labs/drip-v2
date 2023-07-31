import express, {
    json,
    urlencoded,
    Response as ExpressResponse,
    Request as ExpressRequest,
    NextFunction,
} from 'express';

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
        logger.error('uncaught server error', {
            ...getErrLog(err),
        });
        if (err instanceof RestError) {
            res.status(err.status).send({
                error: err.toJSON(),
            });
        } else {
            res.status(500).send({
                error: JSON.stringify(err),
            });
        }
    }
    next();
});
