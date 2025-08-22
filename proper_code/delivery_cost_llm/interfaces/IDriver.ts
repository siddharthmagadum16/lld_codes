export interface IDriver {
  id: string;
  hourlyRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods that the Driver entity implements
  updateRate(newRate: number): void;
  deactivate(): void;
  activate(): void;
}

export interface IDriverService {
  addDriver(driverId: string, payPerHour: number): Promise<IDriver>;
  getDriver(driverId: string): Promise<IDriver | null>;
  getDriverHourlyRate(driverId: string): Promise<number>;
  updateDriverRate(driverId: string, newRate: number): Promise<IDriver>;
  deactivateDriver(driverId: string): Promise<void>;
  getAllDrivers(): Promise<IDriver[]>;
}
