

import { Location, RidePrice, RideStatus, VehicleType } from "../interfaces/interface";
import Driver from "./Driver";
import User from "./User";

class Ride {
  private startLoc: Location;
  private endLoc: Location;
  private user: User;
  private price: number;
  private status: RideStatus;
  private vehicleType: VehicleType;
  private driver: Driver;

  constructor({
    startLoc,
    endLoc,
    user,
    price,
    vehicleType,
    status,
    driver,
  }:any) {
    this.startLoc = startLoc;
    this.endLoc = endLoc;
    this.user = user;
    this.price = price;
    this.vehicleType = vehicleType;
    this.status = status;
    this.driver = driver;
  }



  public getDriver(): Driver {
    return this.driver;
  }
  public getUser = (): User => this.user;
  public getPrice(): number {
    return this.price;
  }

  public getStartLoc = (): Location => this.startLoc;
  public getEndLoc = (): Location => this.endLoc;
  public getStatus = (): RideStatus => this.status;

  public setStatus = (status: RideStatus): RideStatus => this.status = status;
  public setDriver(driver: Driver): void {
    this.driver = driver;
  }
  public setPrice(price: number): void {
    this.price = price;
  }

}


export default Ride;