# Async Task Management Library

A TypeScript library for managing asynchronous tasks with DAG-based dependencies.

## Features

- ✅ **Define tasks** with async execution
- ✅ **Handle task dependencies** (DAG structure)
- ✅ **Global queue** for task management
- ✅ **Task runner** with automatic dependency resolution
- ✅ **Concurrent execution** of independent tasks
- ✅ **Cycle detection** to prevent circular dependencies

## Architecture

### Core Components

1. **Task** - Represents a unit of work
   - Async executor function
   - Dependency tracking
   - Status management (PENDING, RUNNING, COMPLETED, FAILED)

2. **TaskQueue** - Singleton global queue
   - Stores all tasks
   - Validates DAG (no cycles)

3. **TaskRunner** - Executes tasks
   - Respects dependencies
   - Runs independent tasks concurrently
   - Tracks completion status

## Usage

```typescript
import { Task, TaskQueue, TaskRunner } from './index';

// Get queue instance
const queue = TaskQueue.getInstance();

// Create tasks
const taskA = new Task('A', async () => {
  return 'Result A';
});

const taskB = new Task('B', async () => {
  return 'Result B';
}, ['A']); // B depends on A

// Add to queue
queue.addTask(taskA);
queue.addTask(taskB);

// Run all tasks
const runner = new TaskRunner();
await runner.runAll();

// Get results
const results = runner.getResults();
```

## Example

Run the example:
```bash
npx ts-node example.ts
```

## Dependency Graph

Tasks form a DAG where edges represent dependencies:
```
A → C → E
B → D → E  
A → D → E
```

Task E only runs after C and D complete, which themselves wait for A and B.
