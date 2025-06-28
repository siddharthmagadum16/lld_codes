import { DriverStatus, Location, VehicleType } from "../interfaces/interface";

class Driver {
  constructor (
    private name: string,
    private location: Location,
    private vehicleType: VehicleType,
    private status: DriverStatus
  ) {}

  public getLocation = () => this.location;
  public getName = () => this.name;
  public getStatus = () => this.status;
  public getVehicleType = () => this.vehicleType;


  public setStatus = (status: DriverStatus) => this.status = status;
  public setLocation = (loc: Location) => this.location = loc;
}


export default Driver;
