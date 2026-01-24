import { SpotType, VehicleType } from "./interface";

const ALLOWED_SPOTS_FOR_VEHICLE_TYPE = {
  [VehicleType.BIKE]: [SpotType.SMALL],
  [VehicleType.CAR]: [SpotType.MEDIUM, SpotType.LARGE],
  [VehicleType.TRUCK]: [SpotType.LARGE],
}

export {
  ALLOWED_SPOTS_FOR_VEHICLE_TYPE,
}