// Defined here instead of ioC to avoid circular dependency

export const TYPES = {
    IConfig: Symbol('Config'),
    ILogger: Symbol('Logger'),
    IDatabase: Symbol('Database'),
    IAccountRepository: Symbol('AccountRepository'),
    IAccountProcessor: Symbol('AccountProcessor'),
    IInstructionProcessor: Symbol('InstructionProcessor'),
    ITransactionProcessor: Symbol('TransactionProcessor'),
};
