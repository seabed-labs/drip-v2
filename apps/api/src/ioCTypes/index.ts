// Defined here instead of ioC to avoid circular dependency

import { interfaces } from 'inversify';
import { fluentProvide } from 'inversify-binding-decorators';

export const TYPES = {
    IConfig: Symbol('Config'),
    IDatabase: Symbol('Database'),
    IConnection: Symbol('Connection'),
    ITokenListClient: Symbol('TokenListClient'),
    IAccountRepository: Symbol('AccountRepository'),
    IAccountProcessor: Symbol('AccountProcessor'),
    IInstructionProcessor: Symbol('InstructionProcessor'),
    ITransactionProcessor: Symbol('TransactionProcessor'),
    ITokenMinter: Symbol('TokenMinter'),
};

export const provideSingleton = function <T>(
    identifier: interfaces.ServiceIdentifier<T>
) {
    return fluentProvide(identifier).inSingletonScope().done();
};
