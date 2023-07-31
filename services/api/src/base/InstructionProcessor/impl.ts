import { IInstructionProcessor } from './types';

export class InstructionProcessor implements IInstructionProcessor {
    upsertDripInstruction(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
