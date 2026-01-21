/**
 * Asynchronous Queue for thread-safe log processing
 * 
 * Ensures that log operations are processed sequentially,
 * preventing race conditions and data corruption in async environments.
 * 
 * Uses a Promise-based queue to serialize operations.
 */
export class AsyncQueue {
  private _queue: Promise<void> = Promise.resolve();
  private _pendingCount: number = 0;

  /**
   * Enqueue an async operation to be processed sequentially
   * @param operation The async operation to enqueue
   * @returns Promise that resolves when the operation completes
   */
  enqueue<T>(operation: () => Promise<T>): Promise<T> {
    this._pendingCount++;

    const result = this._queue.then(async () => {
      try {
        return await operation();
      } finally {
        this._pendingCount--;
      }
    });

    // Update queue to track this operation
    this._queue = result.then(
      () => {},
      () => {}
    ); // Swallow errors to keep queue running

    return result;
  }

  /**
   * Wait for all pending operations to complete
   */
  async drain(): Promise<void> {
    await this._queue;
  }

  /**
   * Get the number of pending operations
   */
  get pendingCount(): number {
    return this._pendingCount;
  }
}

