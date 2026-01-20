import { Task, TaskQueue, TaskRunner } from './index';

/**
 * Example usage of the async task management library
 */
async function main() {
    const queue = TaskQueue.getInstance();

    // Define tasks with dependencies
    // Task A: no dependencies
    const taskA = new Task('A', async () => {
        console.log('Task A starting...');
        await sleep(500);
        console.log('Task A completed');
        return 'Result A';
    });

    // Task B: no dependencies
    const taskB = new Task('B', async () => {
        console.log('Task B starting...');
        await sleep(1000);
        console.log('Task B completed');
        return 'Result B';
    });

    // Task C: depends on A
    const taskC = new Task('C', async () => {
        console.log('Task C starting...');
        await sleep(800);
        console.log('Task C completed');
        return 'Result C';
    }, ['A']);

    // Task D: depends on A and B
    const taskD = new Task('D', async () => {
        console.log('Task D starting...');
        await sleep(600);
        console.log('Task D completed');
        return 'Result D';
    }, ['A', 'B']);

    // Task E: depends on C and D
    const taskE = new Task('E', async () => {
        console.log('Task E starting...');
        await sleep(300);
        console.log('Task E completed');
        return 'Result E';
    }, ['C', 'D']);

    // Add tasks to queue
    queue.addTask(taskA);
    queue.addTask(taskB);
    queue.addTask(taskC);
    queue.addTask(taskD);
    queue.addTask(taskE);

    console.log('Starting task execution...\n');
    console.log('Dependency graph:');
    console.log('A -> C -> E');
    console.log('B -> D -> E');
    console.log('A -> D -> E\n');

    // Run all tasks
    const runner = new TaskRunner();

    try {
        await runner.runAll();
        console.log('\n✓ All tasks completed successfully!');

        const results = runner.getResults();
        console.log('\nResults:');
        results.forEach((result, taskId) => {
            console.log(`  ${taskId}: ${result}`);
        });
    } catch (error) {
        console.error('Error running tasks:', error);
    }

    // Clear queue for next run
    queue.clear();
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the example
main().catch(console.error);
