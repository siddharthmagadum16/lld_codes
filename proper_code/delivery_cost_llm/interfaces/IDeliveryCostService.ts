import { IDriverService } from './IDriver';
import { IDeliveryService } from './IDelivery';
import { ICostCalculator } from './ICostCalculator';

export interface IDeliveryCostService extends IDriverService, IDeliveryService, ICostCalculator {
  // Main methods required by the question
  addDriver(driverId: string, payPerHour: number): Promise<any>;
  recordDelivery(driverId: string, startTime: Date, endTime: Date): Promise<any>;
  fetchTotalCostIncurredForAllDeliveries(): Promise<number>;
  
  // Additional utility methods
  getSystemStats(): Promise<{
    totalDrivers: number;
    totalDeliveries: number;
    totalCost: number;
    activeDeliveries: number;
  }>;
}
