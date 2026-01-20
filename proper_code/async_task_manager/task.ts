/**
 * Represents the status of a task
 */
export enum TaskStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED'
}

/**
 * Type for task execution function
 */
export type TaskExecutor = () => Promise<any>;

/**
 * Task class representing a single unit of work with dependencies
 */
export class Task {
    public readonly id: string;
    public readonly executor: TaskExecutor;
    public readonly dependencies: Set<string>; // IDs of tasks this task depends on
    public status: TaskStatus;
    public result: any;
    public error: Error | null;

    constructor(id: string, executor: TaskExecutor, dependencies: string[] = []) {
        this.id = id;
        this.executor = executor;
        this.dependencies = new Set(dependencies);
        this.status = TaskStatus.PENDING;
        this.result = null;
        this.error = null;
    }

    /**
     * Check if the task is ready to execute (all dependencies completed)
     */
    isReady(completedTasks: Set<string>): boolean {
        if (this.status !== TaskStatus.PENDING) {
            return false;
        }

        // Task is ready if all its dependencies are in the completed set
        for (const depId of this.dependencies) {
            if (!completedTasks.has(depId)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Execute the task
     */
    async execute(): Promise<void> {
        this.status = TaskStatus.RUNNING;
        try {
            this.result = await this.executor();
            this.status = TaskStatus.COMPLETED;
        } catch (error) {
            this.error = error as Error;
            this.status = TaskStatus.FAILED;
            throw error;
        }
    }
}

// export { TaskExecutor }