import { PricingStrategy, RidePrice, Location } from "../interfaces/interface"
import PricingService from "./pricing";
import RideService  from './ride'
import UserService from './user';
import NotificationService from "./notification";
import { SMSNotificationChannel, EmailNotificationChannel, PushNotificationChannel } from "./notification-channels";
import AnalyticsObserver from "./analytics-observer";
import User from "../entities/User";
import RideRequest from "../entities/RideRequest";
import DriverService from "./driver";
import Driver from "../entities/Driver";
import Ride from "../entities/Ride";

class App {

  private static app: App;

  private pricingService: PricingService;
  private rideService: RideService;
  private userService: UserService;
  private driverService: DriverService;
  private notificationService: NotificationService;
  private analyticsObserver: AnalyticsObserver;


  private constructor() {
    this.pricingService = PricingService.getInstance();
    this.rideService = RideService.getInstance();
    this.userService = UserService.getInstance();
    this.driverService = DriverService.getInstance();
    this.notificationService = NotificationService.getInstance();
    this.analyticsObserver = new AnalyticsObserver();
    
    this.setupNotificationSystem();
  }

  private setupNotificationSystem() {
    // Add different notification channels (Strategy Pattern)
    this.notificationService.addChannel('sms', new SMSNotificationChannel());
    this.notificationService.addChannel('email', new EmailNotificationChannel());
    this.notificationService.addChannel('push', new PushNotificationChannel());
    
    // Subscribe observers for analytics (Observer Pattern)
    this.notificationService.subscribe(this.analyticsObserver);
    
    console.log('🔧 Notification system initialized with multiple channels and observers');
  }

  public getUserService = () => this.userService;

  public static getInstance = () => {
    return this.app ? this.app : this.app = new App();
  }

  public addDriver = (driver: Driver) => this.driverService.addDriver(driver);

  public getPriceEstimate = (startLoc: Location, endLoc: Location) => this.pricingService.getPriceEstimate(startLoc, endLoc);

  public bookRide = (user: User, startLoc: Location, endLoc: Location, ridePrice: RidePrice) => this.rideService.requestRide(user, startLoc, endLoc, ridePrice.price, ridePrice.vehicleType);

  public acceptRideRequest = (rideRequest: RideRequest, driver: Driver) => {
    const isSuccess = this.driverService.acceptRideRequest(rideRequest, driver);
    if (!isSuccess) return null;
    return this.rideService.assignDriverForRide(rideRequest, driver);
  }

  public startRide = (ride: Ride) => this.rideService.startRide(ride);

  public endRide = (ride: Ride) => {
    this.driverService.endRideForDriver(ride.getDriver(), ride.getEndLoc());
    this.rideService.endRide(ride);
  }

  public addUser = (name: string, phone: string) => this.userService.createUser(name, phone);

  // Method to demonstrate multi-channel notifications
  public sendEmergencyNotification = (recipient: string, message: string) => {
    this.notificationService.notifyAllChannels(recipient, message);
  }

  // Method to get analytics data
  public getAnalytics = () => this.analyticsObserver.getStats();

}

export default App;