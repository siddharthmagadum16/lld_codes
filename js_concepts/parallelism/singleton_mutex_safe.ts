import { Mutex } from 'async-mutex';

class DriverService {
  private static readonly instance: DriverService = new DriverService();
  private myMap: Map<string, Map<string, Array<string>>> = new Map();
  private mutex = new Mutex();

  private constructor() {
    this.myMap.set('sfds', new Map([['a', ['1', '2', '3']]]));
  }

  public static getInstance = (): DriverService => DriverService.instance;

  public async getFromMap(key: string): Promise<Map<string, Array<string>> | undefined> {
    return this.mutex.runExclusive(() => this.myMap.get(key));
  }

  public async setInMap(key: string, value: Map<string, Array<string>>): Promise<Map<string,Map<string,string[]>>> {
    return this.mutex.runExclusive(() => this.myMap.set(key, value));
  }

  public async deleteFromMap(key: string): Promise<boolean> {
    return this.mutex.runExclusive(() => this.myMap.delete(key));
  }

  public async hasInMap(key: string): Promise<boolean> {
    return this.mutex.runExclusive(() => this.myMap.has(key));
  }
}

export default DriverService;