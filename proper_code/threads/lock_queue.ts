
class Mutex2 {

  private isLocked = false;
  private lockQueue: Array<() => void> = [];

  private static instance: Mutex2;

  private constructor() {}

  public static getInstance(): Mutex2 {
    if (!Mutex2.instance) {
      Mutex2.instance = new Mutex2();
    }
    return Mutex2.instance;
  }

    /**
   * Acquire lock for thread-safe operations
   */
  private async acquireLock(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isLocked) {
        this.isLocked = true;
        resolve();
      } else {
        this.lockQueue.push(resolve);
      }
    });
  }

  /**
   * Release lock and process next waiting operation
   */
  private releaseLock(): void {
    this.isLocked = false;
    const nextOperation = this.lockQueue.shift();
    if (nextOperation) {
      this.isLocked = true;
      nextOperation();
    }
  }

  /**
   * Execute operation with lock
   */
  private async withLock<T>(operation: () => T): Promise<T> {
    await this.acquireLock();
    try {
      return operation();
    } finally {
      this.releaseLock();
    }
  }
  /*
  async addDriver(driver: IDriver): Promise<void> {
    await this.withLock(() => {
      if (this.drivers.has(driver.id)) {
        throw new Error(`Driver with ID ${driver.id} already exists`);
      }
      this.drivers.set(driver.id, driver);
    });
  }
  */
}