import { Location, RideRequestStatus, RideStatus, VehicleType } from "../interfaces/interface"
import Driver from "./Driver";
import Ride from "./Ride";
import RideRequest from "./RideRequest";
import User from "./User";


interface IRideBuilder {
  setStartLoc(param: Location): IRideBuilder;
  setEndLoc(param: Location): IRideBuilder;
  setPrice(param: number): IRideBuilder;
  setVehicleType(param: VehicleType): IRideBuilder;
  setUser(param: User): IRideBuilder;
  setDriver(param: Driver): IRideBuilder;
}


class RideBuilder implements IRideBuilder {

  private _startLoc!: Location;
  private _endLoc!: Location;
  private _price!: number;
  private _vehicleType!: VehicleType;
  private _user!: User;
  private _driver!: Driver;

  buildRide = () => {
    if ([this._startLoc, this._endLoc, this._price, this._vehicleType, this._user, this._driver].some(x => x === undefined)) {
      throw new Error('Missing Ride details');
    }
    return new Ride({
      startLoc: this._startLoc,
      endLoc: this._endLoc,
      price: this._price,
      vehicleType: this._vehicleType,
      user: this._user,
      status: RideStatus.ASSIGNED,
      driver: this._driver,
    })
  }

  buildRideRequest = () => {
    if ([this._startLoc, this._endLoc, this._price, this._vehicleType, this._user].some(x => x === undefined)) {
      throw new Error('Missing Ridereqst details');
    }

    return new RideRequest({
      _startLoc: this._startLoc,
      _endLoc: this._endLoc,
      _price: this._price,
      _vehicleType: this._vehicleType,
      _user: this._user,
      _status: RideRequestStatus.CREATED,
    })
  }

  setStartLoc(startLoc: Location): RideBuilder {
    this._startLoc = startLoc;
    return this;
  }

  setEndLoc(endLoc: Location): RideBuilder {
    this._endLoc = endLoc;
    return this;
  }

  setPrice(price: number): RideBuilder {
    this._price = price;
    return this;
  }

  setVehicleType(vehicle: VehicleType): RideBuilder {
    this._vehicleType = vehicle;
    return this;
  }

  setUser(user: User): RideBuilder {
    this._user = user;
    return this;
  }

  setDriver(driver: Driver): RideBuilder {
    this._driver = driver;
    return this;
  }

}

export default RideBuilder;
