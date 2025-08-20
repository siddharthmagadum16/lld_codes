
type DriverId = string;

interface IDriverService {
  addDriver(name: string, hourlyRate: number): void;
  // getInstance(): IDriverService;
  getHourlyRateForDriver(driverName: string): number;
}

interface IDeliveryService {
  addDelivery(startTime: Date, endTime: Date, driverName: string): number;
  // getInstance(): IDeliveryService;
  getTotalDeliveryCost(): number;
}

export {
  IDriverService,
  IDeliveryService,
}