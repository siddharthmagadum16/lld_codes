import { VehicleType } from "../interface";


class Vehicle {

  constructor (
    public vehicleId: string,
    public vehicleType: VehicleType,
  ) {}
};

export { Vehicle, }