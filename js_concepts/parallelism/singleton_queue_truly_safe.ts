class DriverService {
  private static readonly instance: DriverService = new DriverService();
  private myMap: Map<string, Map<string, Array<string>>> = new Map();
  private lastOperation: Promise<any> = Promise.resolve();

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }

  public static getInstance = (): DriverService => DriverService.instance;

  // CORRECT: Each operation chains to whatever is the current last operation
  private enqueue<T>(operation: () => T | Promise<T>): Promise<T> {
    // Create a new promise that will execute after the current last operation
    const newOperation = this.lastOperation.then(operation, operation);

    // Update lastOperation to point to our new operation
    // Even if multiple threads do this simultaneously, they'll just chain in some order
    this.lastOperation = newOperation.catch(() => {}); // Catch to prevent unhandled rejection

    return newOperation;
  }

  public getFromMap(key: string): Promise<Map<string, Array<string>> | undefined> {
    return this.enqueue(() => this.myMap.get(key));
  }

  public setInMap(key: string, value: Map<string, Array<string>>): Promise<any> {
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