import Driver from "./entities/Driver";
import Ride from "./entities/Ride";
import User from "./entities/User";
import { DriverStatus, RidePrice, VehicleType } from "./interfaces/interface";
import App from "./services/app";

const delay = (s: number) => {
  console.log('\n')
  return new Promise(resolve => setTimeout(resolve, s * 1000))
};

const Demo = async () => {

  const app = App.getInstance();

  // onboard drivers in platform
  const driver1 = new Driver('driver1', { lat: 100, lng: 101 }, VehicleType.BIKE, DriverStatus.AVAILABLE)
  const driver2 = new Driver('driver2', { lat: 110, lng: 105 }, VehicleType.BIKE, DriverStatus.AVAILABLE)
  const driver3 = new Driver('driver3', { lat: 200, lng: 205 }, VehicleType.AUTO, DriverStatus.AVAILABLE)
  const driver4 = new Driver('driver4', { lat: 210, lng: 210 }, VehicleType.BIKE, DriverStatus.AVAILABLE)
  app.addDriver(driver1);
  app.addDriver(driver2);
  app.addDriver(driver3);
  app.addDriver(driver4);


  // onboard customers in platform
  const user1: User = app.addUser('user1', '123');
  const user2: User = app.addUser('user2', '126');
  const user3: User = app.addUser('user3', '128');

  // ride1
  const startLoc1 = { lat: 99, lng: 94 };
  const endLoc1 = { lat: 50, lng: 49 };
  const priceByVehicleType = app.getPriceEstimate(startLoc1, endLoc1);
  const rideRequest1 = app.bookRide(user1, startLoc1, endLoc1, { vehicleType: VehicleType.BIKE, price: priceByVehicleType[VehicleType.BIKE]});

  // ride2
  const startLoc2 = { lat: 220, lng: 210 };
  const endLoc2 = { lat: 250, lng: 250 };
  const priceByVehicleType2 = app.getPriceEstimate(startLoc2, endLoc2);
  const rideRequest2 = app.bookRide(user2, startLoc2, endLoc2, { vehicleType: VehicleType.AUTO, price: priceByVehicleType2[VehicleType.AUTO]});


  await delay(3);

  const ride1 = app.acceptRideRequest(rideRequest1, driver1);
  const ride2 = app.acceptRideRequest(rideRequest1, driver2);

  const ride3 = app.acceptRideRequest(rideRequest2, driver3);


  console.log('driver1 loc after accept', driver1.getLocation());
  console.log('driver2 loc after accept', driver3.getLocation());


  await delay(3);

  if(ride1) app.endRide(ride1);
  if(ride2) app.endRide(ride2);
  if(ride3) app.endRide(ride3);
  console.log('driver1 loc after end ride', driver1.getLocation());
  console.log('driver2 loc after end ride', driver2.getLocation());
  console.log('driver3 loc after end ride', driver3.getLocation());

}

Demo();