import { Floor } from "./entities/Floor"
import { Gate } from "./entities/Gate"
import { Spot } from "./entities/Spot";
import { Vehicle } from "./entities/Vehicle"

enum GateType  {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  EMERGENCY = 'EMERGENCY'
}

enum SpotType {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

enum VehicleType {
  BIKE = 'BIKE',
  CAR = 'CAR',
  TRUCK = 'TRUCK'
}

interface IParkingStrategy {
  getParkingSpot(vehicle: Vehicle, gate: Gate, floors: Floor[]): Spot | undefined;
}

export {
  GateType,
  SpotType,
  VehicleType,
  IParkingStrategy,
}

