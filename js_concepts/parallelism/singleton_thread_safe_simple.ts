import * as synchronize from 'synchronized-promise';

class DriverService {
  // Eager initialization - instance created at class load time (thread-safe)
  private static readonly instance: DriverService = new DriverService();

  // Map<string,Map<string, Array<string>>>
  private myMap: Map<string, Map<string, Array<string>>> = new Map();

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }

  public static getInstance = (): DriverService => DriverService.instance;

  // Thread-safe operations using synchronize decorator
  public getFromMap = synchronize((key: string) => {
    return this.myMap.get(key);
  });

  public setInMap = synchronize((key: string, value: Map<string, Array<string>>) => {
    this.myMap.set(key, value);
  });

  public deleteFromMap = synchronize((key: string) => {
    return this.myMap.delete(key);
  });

  public hasInMap = synchronize((key: string) => {
    return this.myMap.has(key);
  });
}

export default DriverService;