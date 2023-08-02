// eslint-disable-next-line import/order
import dotenv from 'dotenv';
dotenv.config();

import { Container, decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';

import {
    IInstructionProcessor,
    DripInstructionProcessor,
} from '../base/InstructionProcessor';
import { IAccountProcessor, AccountProcessor } from '../base/accountProcessor';
import { IConfig, Config } from '../base/config';
import { Database, IDatabase } from '../base/database';
import { IAccountRepository, AccountRepository } from '../base/repository';
import { Connection, IConnection } from '../base/rpcConnection';
import {
    ITransactionProcessor,
    TransactionProcessor,
} from '../base/transactionProcessor';
import { PrismaClient } from '../generated/prismaClient';
import { TYPES } from '../ioCTypes';

// https://tsoa-community.github.io/docs/di.html
const iocContainer = new Container({ skipBaseClassChecks: true });
// Makes tsoa's Controller injectable
decorate(injectable(), Controller);
decorate(injectable(), PrismaClient);
// make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());

iocContainer.bind<IConfig>(TYPES.IConfig).to(Config);
iocContainer.bind<IDatabase>(TYPES.IDatabase).to(Database).inSingletonScope();
iocContainer
    .bind<IConnection>(TYPES.IConnection)
    .to(Connection)
    .inSingletonScope();
iocContainer
    .bind<IAccountRepository>(TYPES.IAccountRepository)
    .to(AccountRepository);
iocContainer
    .bind<IAccountProcessor>(TYPES.IAccountProcessor)
    .to(AccountProcessor);
iocContainer
    .bind<IInstructionProcessor>(TYPES.IInstructionProcessor)
    .to(DripInstructionProcessor);
iocContainer
    .bind<ITransactionProcessor>(TYPES.ITransactionProcessor)
    .to(TransactionProcessor);

// export according to tsoa convention
export { iocContainer };
