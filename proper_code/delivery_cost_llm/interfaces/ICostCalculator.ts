export interface ICostCalculator {
  calculateDeliveryCost(driverId: string, startTime: Date, endTime: Date): Promise<number>;
  calculateTotalCostForAllDeliveries(): Promise<number>;
  calculateCostForDriver(driverId: string): Promise<number>;
  calculateCostForDateRange(startDate: Date, endDate: Date): Promise<number>;
}
