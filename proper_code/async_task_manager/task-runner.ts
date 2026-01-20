import { Task, TaskStatus } from './task';
import { TaskQueue } from './task-queue';

/**
 * Task runner that executes tasks respecting dependencies
 */
export class TaskRunner {
    private queue: TaskQueue;
    private completedTasks: Set<string>;
    private failedTasks: Set<string>;
    private runningTasks: Set<string>;

    constructor() {
        this.queue = TaskQueue.getInstance();
        this.completedTasks = new Set();
        this.failedTasks = new Set();
        this.runningTasks = new Set();
    }

    /**
     * Run all tasks in the queue with max concurrency
     */
    async runAll(maxConcurrency: number = 5): Promise<void> {
        // Validate no cycles
        this.queue.validateNoCycles();

        const allTasks = this.queue.getAllTasks();

        if (allTasks.length === 0) {
            return;
        }

        // Keep processing until all tasks are completed or failed
        while (this.completedTasks.size + this.failedTasks.size < allTasks.length) {
            // Check how many more tasks we can run
            const availableSlots = maxConcurrency - this.runningTasks.size;

            if (availableSlots > 0) {
                const readyTasks = this.getReadyTasks();
                const tasksToStart = readyTasks.slice(0, availableSlots);

                if (tasksToStart.length > 0) {
                    // Start tasks without waiting for them to complete
                    tasksToStart.forEach(task => this.executeTask(task));
                }
            }

            if (this.runningTasks.size === 0) {
                // No tasks running and none ready - deadlock
                if (this.completedTasks.size + this.failedTasks.size < allTasks.length) {
                    throw new Error('Deadlock detected: no tasks are ready to run');
                }
                break;
            }

            // Wait for at least one task to complete
            await this.waitForAnyTaskCompletion();
        }

        // Check if any tasks failed
        if (this.failedTasks.size > 0) {
            const failedTaskIds = Array.from(this.failedTasks);
            throw new Error(`Tasks failed: ${failedTaskIds.join(', ')}`);
        }
    }

    /**
     * Get all tasks that are ready to execute
     */
    private getReadyTasks(): Task[] {
        const allTasks = this.queue.getAllTasks();
        return allTasks.filter(task => task.isReady(this.completedTasks));
    }

    /**
     * Execute a single task (non-blocking)
     */
    private async executeTask(task: Task): Promise<void> {
        this.runningTasks.add(task.id);

        try {
            await task.execute();
            this.completedTasks.add(task.id);
        } catch (error) {
            this.failedTasks.add(task.id);
        } finally {
            this.runningTasks.delete(task.id);
        }
    }

    /**
     * Wait for at least one running task to complete
     */
    private async waitForAnyTaskCompletion(): Promise<void> {
        const runningTaskIds = Array.from(this.runningTasks);
        const runningTaskObjects = runningTaskIds
            .map(id => this.queue.getTask(id))
            .filter(task => task !== undefined) as Task[];

        // Simple wait - in a real implementation, you might use events
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    /**
     * Get results of all completed tasks
     */
    getResults(): Map<string, any> {
        const results = new Map<string, any>();
        for (const taskId of this.completedTasks) {
            const task = this.queue.getTask(taskId);
            if (task) {
                results.set(taskId, task.result);
            }
        }
        return results;
    }

    /**
     * Get status of all tasks
     */
    getStatus(): Map<string, TaskStatus> {
        const status = new Map<string, TaskStatus>();
        const allTasks = this.queue.getAllTasks();
        for (const task of allTasks) {
            status.set(task.id, task.status);
        }
        return status;
    }
}
