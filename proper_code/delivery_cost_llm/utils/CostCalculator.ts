import { IDriver } from '../interfaces/IDriver';
import { IDelivery } from '../interfaces/IDelivery';

export class CostCalculator {
  /**
   * Calculate delivery cost based on driver's hourly rate and delivery duration
   */
  static calculateDeliveryCost(driver: IDriver, startTime: Date, endTime: Date): number {
    if (!driver.isActive) {
      throw new Error(`Driver ${driver.id} is not active`);
    }

    if (startTime >= endTime) {
      throw new Error('Start time must be before end time');
    }

    const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    const cost = durationInHours * driver.hourlyRate;
    
    // Round to 2 decimal places for currency
    return Math.round(cost * 100) / 100;
  }

  /**
   * Calculate total cost for all deliveries
   */
  static calculateTotalCost(deliveries: IDelivery[]): number {
    return deliveries
      .filter(delivery => delivery.status !== 'CANCELLED')
      .reduce((total, delivery) => total + delivery.cost, 0);
  }

  /**
   * Calculate cost for a specific driver
   */
  static calculateDriverCost(deliveries: IDelivery[], driverId: string): number {
    return deliveries
      .filter(delivery => 
        delivery.driverId === driverId && 
        delivery.status !== 'CANCELLED'
      )
      .reduce((total, delivery) => total + delivery.cost, 0);
  }

  /**
   * Calculate cost for deliveries within a date range
   */
  static calculateCostForDateRange(
    deliveries: IDelivery[], 
    startDate: Date, 
    endDate: Date
  ): number {
    return deliveries
      .filter(delivery => 
        delivery.startTime >= startDate && 
        delivery.endTime <= endDate && 
        delivery.status !== 'CANCELLED'
      )
      .reduce((total, delivery) => total + delivery.cost, 0);
  }
}
