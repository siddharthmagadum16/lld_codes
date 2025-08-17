enum RideStatus {
  ASSIGNED,
  STARTED,
  ENDED,
  CANCELLED,
}

enum DriverStatus {
  BUSY,
  AVAILABLE
}

interface Location {
  lat: number;
  lng: number;
}

enum VehicleType {
  BIKE,
  AUTO,
  CAR,
}

enum RideRequestStatus {
  CREATED,
  CANCELLED,
  FULFILLED,
}


interface IObserver {
  update(rideStatus: RideStatus): void;
}

// Notification related interfaces
interface INotificationChannel {
  send(recipient: string, message: string, type: NotificationType): void;
}

interface INotificationObserver {
  onRideRequested(driverName: string, userRequest: string): void;
  onRideStarted(userName: string, driverName: string): void;
  onRideEnded(userName: string, price: number): void;
  onRideRequestFulfilled(driverName: string): void;
}

enum NotificationType {
  RIDE_REQUEST = 'RIDE_REQUEST',
  RIDE_STARTED = 'RIDE_STARTED',
  RIDE_ENDED = 'RIDE_ENDED',
  RIDE_REQUEST_FULFILLED = 'RIDE_REQUEST_FULFILLED',
  GENERAL = 'GENERAL'
}

interface PricingStrategy {
  getPriceEstimate(startLoc: Location, endLoc: Location): number;
}

interface RidePrice {
  vehicleType: VehicleType
  price: number;
}



export {
  IObserver,
  INotificationChannel,
  INotificationObserver,
  NotificationType,
  RideStatus,
  Location,
  PricingStrategy,
  RidePrice,
  VehicleType,
  DriverStatus,
  RideRequestStatus,
}
