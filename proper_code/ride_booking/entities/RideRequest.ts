import { Location, RideRequestStatus, VehicleType } from '../interfaces/interface'
import User from './User';

class RideRequest {
  private startLoc: Location;
  private endLoc: Location;
  private price: number;
  private user: User;
  private vehicleType: VehicleType;
  private status: RideRequestStatus;


  public constructor ({
    _startLoc,
    _endLoc,
    _price,
    _user,
    _vehicleType,
    _status,
  }: any) {
    this.startLoc = _startLoc;
    this.endLoc = _endLoc
    this.price = _price;
    this.user = _user;
    this.vehicleType = _vehicleType;
    this.status = _status
  }
  public getStartLoc = (): Location => this.startLoc;
  public getPrice = (): number => this.price;
  public getUser = (): User => this.user;
  public getStatus = (): RideRequestStatus => this.status;
  public getEndLoc = (): Location => this.endLoc;
  public getVehicleType = (): VehicleType => this.vehicleType;

  public setStatus = (status: RideRequestStatus): RideRequestStatus => this.status = status;
}


export default RideRequest;
