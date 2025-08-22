import { IDriver } from '../interfaces/IDriver';
import { IDelivery } from '../interfaces/IDelivery';

/**
 * Thread-safe in-memory data store for drivers and deliveries
 * Uses a simple mutex-like approach for concurrent access
 */
export class InMemoryStore {
  private static instance: InMemoryStore;
  private drivers: Map<string, IDriver> = new Map();
  private deliveries: Map<string, IDelivery> = new Map();
  private isLocked: boolean = false;
  private lockQueue: Array<() => void> = [];

  private constructor() {}

  public static getInstance(): InMemoryStore {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }
    return InMemoryStore.instance;
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

  // Driver operations
  async addDriver(driver: IDriver): Promise<void> {
    await this.withLock(() => {
      if (this.drivers.has(driver.id)) {
        throw new Error(`Driver with ID ${driver.id} already exists`);
      }
      this.drivers.set(driver.id, driver);
    });
  }

  async getDriver(driverId: string): Promise<IDriver | null> {
    return await this.withLock(() => {
      return this.drivers.get(driverId) || null;
    });
  }

  async updateDriver(driver: IDriver): Promise<void> {
    await this.withLock(() => {
      if (!this.drivers.has(driver.id)) {
        throw new Error(`Driver with ID ${driver.id} not found`);
      }
      this.drivers.set(driver.id, driver);
    });
  }

  async getAllDrivers(): Promise<IDriver[]> {
    return await this.withLock(() => {
      return Array.from(this.drivers.values());
    });
  }

  // Delivery operations
  async addDelivery(delivery: IDelivery): Promise<void> {
    await this.withLock(() => {
      this.deliveries.set(delivery.id, delivery);
    });
  }

  async getDelivery(deliveryId: string): Promise<IDelivery | null> {
    return await this.withLock(() => {
      return this.deliveries.get(deliveryId) || null;
    });
  }

  async updateDelivery(delivery: IDelivery): Promise<void> {
    await this.withLock(() => {
      if (!this.deliveries.has(delivery.id)) {
        throw new Error(`Delivery with ID ${delivery.id} not found`);
      }
      this.deliveries.set(delivery.id, delivery);
    });
  }

  async getAllDeliveries(): Promise<IDelivery[]> {
    return await this.withLock(() => {
      return Array.from(this.deliveries.values());
    });
  }

  async getDeliveriesByDriver(driverId: string): Promise<IDelivery[]> {
    return await this.withLock(() => {
      return Array.from(this.deliveries.values())
        .filter(delivery => delivery.driverId === driverId);
    });
  }

  // Utility methods
  async getDriverCount(): Promise<number> {
    return await this.withLock(() => this.drivers.size);
  }

  async getDeliveryCount(): Promise<number> {
    return await this.withLock(() => this.deliveries.size);
  }

  async clear(): Promise<void> {
    await this.withLock(() => {
      this.drivers.clear();
      this.deliveries.clear();
    });
  }
}
