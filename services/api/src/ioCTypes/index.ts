// Defined here instead of ioC to avoid circular dependency

export const TYPES = {
    IConfig: Symbol('Config'),
    ILogger: Symbol('Logger'),
    IAccountProcessor: Symbol('AccountProcessor'),
    IAccountRepository: Symbol('AccountRepository'),
    IInstructionProcessor: Symbol('InstructionProcessor'),
    ITransactionProcessor: Symbol('TransactionProcessor'),
};
