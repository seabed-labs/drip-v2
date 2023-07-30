// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();

import * as zg from 'zapatos/generate';

const zapCfg: zg.Config = {
    db: {
        connectionString: process.env.API_DATABASE_URL,
    },
    outDir: './src/generated/db',
    customTypesTransform: 'PgMyType',
};

zg.generate(zapCfg)
    .then(() => console.log('done generation zapatos files'))
    .catch((e) => {
        console.log('failed to generate zapatos files');
        console.error(e);
    });
