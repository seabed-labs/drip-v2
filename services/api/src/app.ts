import express, {
    json,
    urlencoded,
    Response as ExpressResponse,
    Request as ExpressRequest,
    NextFunction,
} from 'express';

import { RestError } from './controllers/types';
import { RegisterRoutes } from './generated/api';

export const app = express();

app.use(
    urlencoded({
        extended: true,
    })
);
app.use(json());

RegisterRoutes(app);

app.use(function errorHandler(
    err: unknown,
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
): ExpressResponse | void {
    console.error(err);
    console.error((err as RestError).stack);
    if (typeof (err as RestError)['toJSON'] !== 'function') {
        err = RestError.internal(JSON.stringify(err));
    }
    res.status((err as RestError).status ?? 500).send(
        (err as RestError).toJSON()
    );
    next();
});
