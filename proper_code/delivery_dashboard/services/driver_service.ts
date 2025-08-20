import Driver from "../entities/Driver";
import { IDriverService } from "../interfaces/interface";


class DriverService implements IDriverService {
  private static instance: IDriverService;
  
  private static drivers = new Map<string, Driver>();
  
  static getInstance = (): IDriverService => {
    if (!DriverService.instance) {
      DriverService.instance  = new DriverService();
    }
    return DriverService.instance;
  }

  addDriver(name: string, hourlyRate: number): void {
    if (DriverService.drivers.has(name)) {
      console.log('Driver already present in system');
      return ;
    }
    const newDriver: Driver = new Driver(name, hourlyRate);
    DriverService.drivers.set(name, newDriver);
  }

  getHourlyRateForDriver = (name: string): number => {
    if (!DriverService.drivers.has(name)) {
      throw new Error("Driver not found");
    }
    return DriverService.drivers.get(name)!.getHourlyRate();
  }
}

export default DriverService;