class DriverService {
  private static readonly instance: DriverService = new DriverService();
  private myMap: Map<string, Map<string, Array<string>>> = new Map();
  private operationQueue: Promise<any> = Promise.resolve();
  private queueLock = false;

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }

  public static getInstance = (): DriverService => DriverService.instance;

  // FIXED: Atomic enqueue operation
  private async enqueue<T>(operation: () => T | Promise<T>): Promise<T> {
    // Spin-wait for atomic access to queue modification
    while (this.queueLock) {
      await new Promise(resolve => setImmediate(resolve));
    }

    this.queueLock = true;
    try {
      const currentQueue = this.operationQueue;
      const newPromise = currentQueue.then(operation, operation);
      this.operationQueue = newPromise;
      return newPromise;
    } finally {
      this.queueLock = false;
    }
  }

  public getFromMap(key: string): Promise<Map<string, Array<string>> | undefined> {
    return this.enqueue(() => this.myMap.get(key));
  }

  public setInMap(key: string, value: Map<string, Array<string>>): Promise<void> {
    return this.enqueue(() => this.myMap.set(key, value));
  }

  public deleteFromMap(key: string): Promise<boolean> {
    return this.enqueue(() => this.myMap.delete(key));
  }

  public hasInMap(key: string): Promise<boolean> {
    return this.enqueue(() => this.myMap.has(key));
  }
}

export default DriverService;