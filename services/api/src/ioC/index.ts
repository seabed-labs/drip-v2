// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { Container, decorate, injectable, interfaces } from 'inversify';
import {
    buildProviderModule,
    fluentProvide,
} from 'inversify-binding-decorators';
import { Controller } from 'tsoa';

import {
    IInstructionProcessor,
    InstructionProcessor,
} from '../base/InstructionProcessor';
import { IAccountProcessor, AccountProcessor } from '../base/accountProcessor';
import { IConfig, Config } from '../base/config';
import { DatabasePool, IDatabasePool } from '../base/databasePool';
import { ILogger, Logger } from '../base/logger';
import { IAccountRepository, AccountRepository } from '../base/repository';
import {
    ITransactionProcessor,
    TransactionProcessor,
} from '../base/transactionProcessor';
import { TYPES } from '../ioCTypes';

// https://tsoa-community.github.io/docs/di.html

export const provideSingleton = function <T>(
    identifier: interfaces.ServiceIdentifier<T>
) {
    return fluentProvide(identifier).inSingletonScope().done();
};

const iocContainer = new Container();
// Makes tsoa's Controller injectable
decorate(injectable(), Controller);
// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

iocContainer.bind<ILogger>(TYPES.IConfig).to(Logger);
iocContainer.bind<IConfig>(TYPES.IConfig).to(Config);
iocContainer.bind<IDatabasePool>(TYPES.IDatabasePool).to(DatabasePool);
iocContainer
    .bind<IAccountProcessor>(TYPES.IAccountProcessor)
    .to(AccountProcessor);
iocContainer
    .bind<IAccountRepository>(TYPES.IAccountProcessor)
    .to(AccountRepository);
iocContainer
    .bind<IInstructionProcessor>(TYPES.IInstructionProcessor)
    .to(InstructionProcessor);
iocContainer
    .bind<ITransactionProcessor>(TYPES.ITransactionProcessor)
    .to(TransactionProcessor);

// export according to tsoa convention
export { iocContainer };
