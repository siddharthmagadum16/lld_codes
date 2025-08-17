import Driver from "../entities/Driver"
import Ride from "../entities/Ride"
import RideRequest from "../entities/RideRequest"
import { DriverStatus, Location, RideStatus, RideRequestStatus, VehicleType } from "../interfaces/interface"
import NotificationService from "./notification"


class DriverService {

  private static drivers: Driver[];
  private static instance: DriverService;
  private notificationService: NotificationService;

  private constructor() {
    DriverService.drivers = [];
    this.notificationService = NotificationService.getInstance();
  }
  public static getInstance = (): DriverService => this.instance ?? (this.instance = new DriverService())


  private isDriverNear = (userLoc: Location, driverLoc: Location) => {
    return Math.abs(userLoc.lat - driverLoc.lat) + Math.abs(userLoc.lng - userLoc.lng) <= 20;
  }


  private getReleventDrivers = (startLoc: Location, chosenVehicleType: VehicleType) => {

    return DriverService.drivers.reduce((nearestDrivers: Driver[], driver: Driver) => {
      if (this.isDriverNear(startLoc, driver.getLocation()) && chosenVehicleType === driver.getVehicleType()) {
        nearestDrivers.push(driver);
      }
      return nearestDrivers;
    }, []);
  }

  public notifyNewRideRequest = (nearestDrivers: Driver[], rideRequest: RideRequest) => {
    nearestDrivers.forEach((driver: Driver) => 
      this.notificationService.notifyRideRequested(driver.getName(), rideRequest.getUser().getName())
    );
  }

  public notifyRideRequestForNearestDrivers = (rideRequest: RideRequest) => {
    const nearestDrivers = this.getReleventDrivers(rideRequest.getStartLoc(), rideRequest.getVehicleType());
    this.notifyNewRideRequest(nearestDrivers, rideRequest);
  }


  public acceptRideRequest = (rideRquest: RideRequest, driver: Driver) => {
    if (rideRquest.getStatus() === RideRequestStatus.CREATED && driver.getStatus() == DriverStatus.AVAILABLE) {
      driver.setStatus(DriverStatus.BUSY);
      console.log('[INFO]:', driver.getName(), 'accepted rideRequest from user: ', rideRquest.getUser().getName());
      driver.setLocation(rideRquest.getStartLoc());
      return true;
      // return RideService.getInstance().assignDriverForRide(rideRquest, driver);
    }
    this.notificationService.notifyRideRequestFulfilled(driver.getName());
    return false;
  }

  public endRideForDriver = (driver: Driver, endLoc: Location) => {
    console.log('[INFO]: Ending ride for driver: ', driver.getName());
    driver.setStatus(DriverStatus.AVAILABLE);
    driver.setLocation(endLoc);
  }

  public addDriver = (driver: Driver) => {
    DriverService.drivers.push(driver);
  }
}

export default DriverService
