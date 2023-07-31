import { injectable } from 'inversify';

import { IInstructionProcessor } from './types';

@injectable()
export class InstructionProcessor implements IInstructionProcessor {
    upsertDripInstruction(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
