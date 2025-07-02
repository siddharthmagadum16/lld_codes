class DriverService {
  private static readonly instance: DriverService = new DriverService();
  private myMap: Map<string, Map<string, Array<string>>> = new Map();
  private operationQueue: Promise<any> = Promise.resolve();

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }
   
  public static getInstance = (): DriverService => DriverService.instance;

  private enqueue<T>(operation: () => T): Promise<T> {
    return this.operationQueue = this.operationQueue.then(operation, operation);
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