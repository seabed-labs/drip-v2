import { spawn } from 'node:child_process';
import console from 'node:console';
import process from 'node:process';

const isParallel = process.env.TEST_MODE !== 'debug';
const scope = process.argv[2] ? process.argv[2] : 'program-tests/**';
const testCommand = `yarn run ts-mocha -p ./tsconfig.json -t 1000000 ${
    isParallel ? '--parallel ' : ''
}${scope}/*.test.ts`;

console.log('Running:', testCommand);
const [command, ...args] = testCommand.split(' ');

spawn(command, args, {
    cwd: process.cwd(),
    detached: false,
    stdio: 'inherit',
});
