const { spawn } = require('node:child_process');
const localnet = spawn('anchor', ['localnet']);

// Propagate SIGINT to the child process
process.on('SIGINT', () => {
    childProcess.kill('SIGINT');
});

localnet.stdout.on('data', (data) => {
  console.log(`${data}`);
});

localnet.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

localnet.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
