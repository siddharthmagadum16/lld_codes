// main.ts
import { Worker } from 'worker_threads';
import * as path from 'path';

const workerCount = 2;
const totalNumbers = 1000000000;
const numbersPerWorker = totalNumbers / workerCount;
let completedWorkers = 0;
let totalSum = 0;

console.time('Parallel Execution');

for (let i = 0; i < workerCount; i++) {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'), {
      eval: true,
      workerData: {
        start: i * numbersPerWorker,
        end: (i + 1) * numbersPerWorker,
      },
    });

    worker.on('message', (sum: number) => {
        totalSum += sum;
        completedWorkers++;

        if (completedWorkers === workerCount) {
            console.log(`Final Sum: ${totalSum}`);
            console.timeEnd('Parallel Execution');
        }
    });

    worker.on('error', (err) => {
        console.error(err);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Worker stopped with exit code ${code}`);
        }
    });
}