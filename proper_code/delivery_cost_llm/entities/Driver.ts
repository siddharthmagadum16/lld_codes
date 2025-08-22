import { IDriver } from '../interfaces/IDriver';

export class Driver implements IDriver {
  public readonly id: string;
  public hourlyRate: number;
  public isActive: boolean;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(driverId: string, payPerHour: number) {
    if (payPerHour <= 0) {
      throw new Error('Hourly rate must be positive');
    }
    
    this.id = driverId;
    this.hourlyRate = payPerHour;
    this.isActive = true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateRate(newRate: number): void {
    if (newRate <= 0) {
      throw new Error('Hourly rate must be positive');
    }
    this.hourlyRate = newRate;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
