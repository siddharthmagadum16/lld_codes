class DriverService {
  // Eager initialization - instance created at class load time (thread-safe)
  private static readonly instance: DriverService = new DriverService();

  // Map<string,Map<string, Array<string>>>
  private myMap: Map<string, Map<string, Array<string>>> = new Map();
  private mutex: boolean = false; // Simple mutex lock

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }

  public static getInstance = (): DriverService => DriverService.instance;

  // Thread-safe methods for myMap operations
  private async acquireLock(): Promise<void> {
    while (this.mutex) {
      await new Promise(resolve => setTimeout(resolve, 1)); // Wait 1ms
    }
    this.mutex = true;
  }

  private releaseLock(): void {
    this.mutex = false;
  }

  // Thread-safe get operation
  public async getFromMap(key: string): Promise<Map<string, Array<string>> | undefined> {
    await this.acquireLock();
    try {
      return this.myMap.get(key);
    } finally {
      this.releaseLock();
    }
  }

  // Thread-safe set operation
  public async setInMap(key: string, value: Map<string, Array<string>>): Promise<void> {
    await this.acquireLock();
    try {
      this.myMap.set(key, value);
    } finally {
      this.releaseLock();
    }
  }

  // Thread-safe delete operation
  public async deleteFromMap(key: string): Promise<boolean> {
    await this.acquireLock();
    try {
      return this.myMap.delete(key);
    } finally {
      this.releaseLock();
    }
  }

  // Thread-safe has operation
  public async hasInMap(key: string): Promise<boolean> {
    await this.acquireLock();
    try {
      return this.myMap.has(key);
    } finally {
      this.releaseLock();
    }
  }
}

export default DriverService;
