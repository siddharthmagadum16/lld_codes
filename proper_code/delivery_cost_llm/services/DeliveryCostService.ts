import { IDeliveryCostService } from '../interfaces/IDeliveryCostService';
import { IDriver } from '../interfaces/IDriver';
import { IDelivery } from '../interfaces/IDelivery';
import { Driver } from '../entities/Driver';
import { Delivery } from '../entities/Delivery';
import { CostCalculator } from '../utils/CostCalculator';
import { InMemoryStore } from '../utils/InMemoryStore';

/**
 * Main service class that implements all delivery cost tracking functionality
 * Follows SOLID principles and uses dependency injection
 */
export class DeliveryCostService implements IDeliveryCostService {
  private static instance: DeliveryCostService;
  private store: InMemoryStore;

  private constructor() {
    this.store = InMemoryStore.getInstance();
  }

  public static getInstance(): DeliveryCostService {
    if (!DeliveryCostService.instance) {
      DeliveryCostService.instance = new DeliveryCostService();
    }
    return DeliveryCostService.instance;
  }

  // Main methods required by the question

  /**
   * 1. Add a new driver with hourly payment rate
   */
  async addDriver(driverId: string, payPerHour: number): Promise<IDriver> {
    if (!driverId || driverId.trim() === '') {
      throw new Error('Driver ID cannot be empty');
    }

    if (payPerHour <= 0) {
      throw new Error('Hourly rate must be positive');
    }

    const driver = new Driver(driverId, payPerHour);
    await this.store.addDriver(driver);
    
    console.log(`✅ Driver ${driverId} added with hourly rate $${payPerHour}`);
    return driver;
  }

  /**
   * 2. Record a delivery with start and end time
   */
  async recordDelivery(driverId: string, startTime: Date, endTime: Date): Promise<IDelivery> {
    if (!driverId || driverId.trim() === '') {
      throw new Error('Driver ID cannot be empty');
    }

    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    if (startTime > new Date()) {
      throw new Error('Start time cannot be in the future');
    }

    const driver = await this.store.getDriver(driverId);
    if (!driver) {
      throw new Error(`Driver ${driverId} not found`);
    }

    if (!driver.isActive) {
      throw new Error(`Driver ${driverId} is not active`);
    }

    const cost = CostCalculator.calculateDeliveryCost(driver, startTime, endTime);
    const delivery = new Delivery(driverId, startTime, endTime, cost);
    
    await this.store.addDelivery(delivery);
    
    console.log(`📦 Delivery recorded for driver ${driverId}: ${delivery.duration.toFixed(2)} hours, Cost: $${cost}`);
    return delivery;
  }

  /**
   * 3. Calculate total cost of delivery for all drivers
   */
  async fetchTotalCostIncurredForAllDeliveries(): Promise<number> {
    const deliveries = await this.store.getAllDeliveries();
    const totalCost = CostCalculator.calculateTotalCost(deliveries);
    
    console.log(`💰 Total cost for all deliveries: $${totalCost.toFixed(2)}`);
    return totalCost;
  }

  // Additional methods from interfaces

  async getDriver(driverId: string): Promise<IDriver | null> {
    return await this.store.getDriver(driverId);
  }

  async getDriverHourlyRate(driverId: string): Promise<number> {
    const driver = await this.store.getDriver(driverId);
    if (!driver) {
      throw new Error(`Driver ${driverId} not found`);
    }
    return driver.hourlyRate;
  }

  async updateDriverRate(driverId: string, newRate: number): Promise<IDriver> {
    const driver = await this.store.getDriver(driverId);
    if (!driver) {
      throw new Error(`Driver ${driverId} not found`);
    }

    driver.updateRate(newRate);
    await this.store.updateDriver(driver);
    
    console.log(`🔄 Driver ${driverId} rate updated to $${newRate}/hour`);
    return driver;
  }

  async deactivateDriver(driverId: string): Promise<void> {
    const driver = await this.store.getDriver(driverId);
    if (!driver) {
      throw new Error(`Driver ${driverId} not found`);
    }

    driver.deactivate();
    await this.store.updateDriver(driver);
    
    console.log(`🚫 Driver ${driverId} deactivated`);
  }

  async getAllDrivers(): Promise<IDriver[]> {
    return await this.store.getAllDrivers();
  }

  async getDelivery(deliveryId: string): Promise<IDelivery | null> {
    return await this.store.getDelivery(deliveryId);
  }

  async getDeliveriesByDriver(driverId: string): Promise<IDelivery[]> {
    return await this.store.getDeliveriesByDriver(driverId);
  }

  async getAllDeliveries(): Promise<IDelivery[]> {
    return await this.store.getAllDeliveries();
  }

  async cancelDelivery(deliveryId: string): Promise<void> {
    const delivery = await this.store.getDelivery(deliveryId);
    if (!delivery) {
      throw new Error(`Delivery ${deliveryId} not found`);
    }

    delivery.cancel();
    await this.store.updateDelivery(delivery);
    
    console.log(`❌ Delivery ${deliveryId} cancelled`);
  }

  async calculateDeliveryCost(driverId: string, startTime: Date, endTime: Date): Promise<number> {
    const driver = await this.store.getDriver(driverId);
    if (!driver) {
      throw new Error(`Driver ${driverId} not found`);
    }

    return CostCalculator.calculateDeliveryCost(driver, startTime, endTime);
  }

  async calculateTotalCostForAllDeliveries(): Promise<number> {
    return await this.fetchTotalCostIncurredForAllDeliveries();
  }

  async calculateCostForDriver(driverId: string): Promise<number> {
    const deliveries = await this.store.getDeliveriesByDriver(driverId);
    return CostCalculator.calculateDriverCost(deliveries, driverId);
  }

  async calculateCostForDateRange(startDate: Date, endDate: Date): Promise<number> {
    const deliveries = await this.store.getAllDeliveries();
    return CostCalculator.calculateCostForDateRange(deliveries, startDate, endDate);
  }

  async getSystemStats(): Promise<{
    totalDrivers: number;
    totalDeliveries: number;
    totalCost: number;
    activeDeliveries: number;
  }> {
    const drivers = await this.store.getAllDrivers();
    const deliveries = await this.store.getAllDeliveries();
    
    const totalCost = CostCalculator.calculateTotalCost(deliveries);
    const activeDeliveries = deliveries.filter(d => d.isActive()).length;

    return {
      totalDrivers: drivers.length,
      totalDeliveries: deliveries.length,
      totalCost,
      activeDeliveries
    };
  }
}
