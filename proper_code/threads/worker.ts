// worker.ts
import { parentPort, workerData } from 'worker_threads';

const { start, end } = workerData as { start: number; end: number };

let sum = 0;
for (let i = start; i < end; i++) {
    sum += i;
}

if (parentPort) {
    parentPort.postMessage(sum);
}