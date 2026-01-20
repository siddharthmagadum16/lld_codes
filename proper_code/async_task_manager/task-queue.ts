import { Task } from './task';

/**
 * Global task queue managing all tasks
 */
export class TaskQueue {
    private static instance: TaskQueue;
    private tasks: Map<string, Task>;

    private constructor() {
        this.tasks = new Map();
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): TaskQueue {
        if (!TaskQueue.instance) {
            TaskQueue.instance = new TaskQueue();
        }
        return TaskQueue.instance;
    }

    /**
     * Add a task to the queue
     */
    addTask(task: Task): void {
        if (this.tasks.has(task.id)) {
            throw new Error(`Task with id ${task.id} already exists`);
        }
        this.tasks.set(task.id, task);
    }

    /**
     * Get a task by ID
     */
    getTask(id: string): Task | undefined {
        return this.tasks.get(id);
    }

    /**
     * Get all tasks
     */
    getAllTasks(): Task[] {
        return Array.from(this.tasks.values());
    }

    /**
     * Clear all tasks
     */
    clear(): void {
        this.tasks.clear();
    }

    /**
     * Validate that there are no circular dependencies
     */
    validateNoCycles(): void {
        const visited = new Set<string>();
        const recStack = new Set<string>();

        const hasCycle = (taskId: string): boolean => {
            if (!visited.has(taskId)) {
                visited.add(taskId);
                recStack.add(taskId);

                const task = this.tasks.get(taskId);
                if (task) {
                    for (const depId of task.dependencies) {
                        if (!this.tasks.has(depId)) {
                            throw new Error(`Task ${taskId} depends on non-existent task ${depId}`);
                        }
                        if (!visited.has(depId) && hasCycle(depId)) {
                            return true;
                        } else if (recStack.has(depId)) {
                            return true;
                        }
                    }
                }
            }
            recStack.delete(taskId);
            return false;
        };

        for (const taskId of this.tasks.keys()) {
            if (hasCycle(taskId)) {
                throw new Error('Circular dependency detected in task graph');
            }
        }
    }
}
