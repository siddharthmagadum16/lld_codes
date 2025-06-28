
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

interface PricingStrategy {
  getPriceEstimate(startLoc: Location, endLoc: Location): number;
}

interface RidePrice {
  vehicleType: VehicleType
  price: number;
}



export {
  IObserver,
  RideStatus,
  Location,
  PricingStrategy,
  RidePrice,
  VehicleType,
  DriverStatus,
  RideRequestStatus,
}
