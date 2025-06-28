import Driver from "../entities/Driver";
import Ride from "../entities/Ride";
import RideBuilder from "../entities/RideBuilder";
import RideRequest from "../entities/RideRequest";
import User from "../entities/User";
import { RidePrice, Location, VehicleType, RideRequestStatus, RideStatus } from "../interfaces/interface";
import DriverService from "./driver";
import UserService from "./user";


class RideService {

  private static instance: RideService;
  private static driverService: DriverService;
  private static userService: UserService;
  private static rides: Ride[];
  private static rideRequests: RideRequest[];
  private constructor() {
    RideService.driverService = DriverService.getInstance();
    RideService.userService = UserService.getInstance();
    RideService.rides = [];
    RideService.rideRequests = [];
  }
  public static getInstance = (): RideService => this.instance ?? (this.instance = new RideService())

  private createRide = (rideRequest: RideRequest, driver: Driver) => {
    const ride = new RideBuilder()
      .setStartLoc(rideRequest.getStartLoc())
      .setEndLoc(rideRequest.getEndLoc())
      .setPrice(rideRequest.getPrice())
      .setVehicleType(rideRequest.getVehicleType())
      .setUser(rideRequest.getUser())
      .setDriver(driver)
      .buildRide();
    RideService.rides.push(ride);
    return ride;
  }

  private createRideRequest = ({
    user,
    startLoc,
    endLoc,
    price,
    vehicleType
  }: any) => {
    const rideRequest = new RideBuilder()
      .setStartLoc(startLoc)
      .setEndLoc(endLoc)
      .setPrice(price)
      .setVehicleType(vehicleType)
      .setUser(user)
      .buildRideRequest();
    RideService.rideRequests.push(rideRequest);
    return rideRequest;
  }


  public requestRide = (user: User, startLoc: Location, endLoc: Location, price: number, vehicleType: VehicleType) => {
    const rideRequest: RideRequest = this.createRideRequest({ user, startLoc, endLoc, price, vehicleType });
    RideService.driverService.notifyRideRequestForNearestDrivers(rideRequest);
    return rideRequest;
  }

  public assignDriverForRide = (rideRequest: RideRequest, driver: Driver) => {
    rideRequest.setStatus(RideRequestStatus.FULFILLED);
    const ride: Ride = this.createRide(rideRequest, driver);

    console.log('[INFO]: ride created for user:', ride.getUser().getName(), 'with driver:', ride.getDriver().getName());
    return ride;
  }

  public startRide = (ride: Ride) => {
    if (ride.getStatus() !== RideStatus.ASSIGNED) {
      console.error('[ERROR]: Unable to start the ride');
    }
    ride.setStatus(RideStatus.STARTED);
    RideService.userService.notifyRideStarted(ride);
  }

  public endRide = (ride: Ride) => {
    ride.setStatus(RideStatus.ENDED);
    console.log(`[INFO]: Ride ended for user:${ride.getUser().getName()}, served by driver:${ride.getDriver().getName()}`);
  }
}


export default RideService;