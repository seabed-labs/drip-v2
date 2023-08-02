import { spawn } from 'node:child_process';
import console from 'node:console';
import process from 'node:process';

let testCommand =
    'yarn run ts-mocha -p ./tsconfig.json -t 1000000 --parallel tests/**/*.ts';
if (process.env.TEST_MODE === 'debug') {
    testCommand =
        'yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts';
}

console.log('Running:', testCommand);
const [command, ...args] = testCommand.split(' ');

spawn(command, args, {
    cwd: process.cwd(),
    detached: false,
    stdio: 'inherit',
});
