import { ALLOWED_SPOTS_FOR_VEHICLE_TYPE } from "../constants";
import { Floor } from "../entities/Floor";
import { Gate } from "../entities/Gate";
import { Spot } from "../entities/Spot";
import { Vehicle } from "../entities/Vehicle";
import { IParkingStrategy } from "../interface";


class ParkingStrategyService {

  private static instance: ParkingStrategyService;

  private constructor() {}

  static getInstance (): ParkingStrategyService {
    return ParkingStrategyService.instance ? ParkingStrategyService.instance : ParkingStrategyService.instance = new ParkingStrategyService();
  }

  public getParkingSpot(vehicle: Vehicle, gate: Gate, floors: Floor[]) {
    return (new NearestParkingStrategy()).getParkingSpot(vehicle,gate,floors);
  }
}


class NearestParkingStrategy implements IParkingStrategy {
  
  getParkingSpot(_vehicle: Vehicle, _gate: Gate, _floors: Floor[]): Spot | undefined {
    let chosenSpot: Spot | undefined = undefined;
    const vehicleType = _vehicle.vehicleType;
    _floors.some((floor: Floor) => {
      const availableSpots: Spot[] = floor.getAvailableSpots();
      availableSpots.some((spot: Spot): boolean => {
        if (ALLOWED_SPOTS_FOR_VEHICLE_TYPE[vehicleType].includes(spot.spotType)) {
          chosenSpot = spot;
        }
        return !!chosenSpot;
      })
      return !!chosenSpot;
    })
    return chosenSpot;
  }
}

export { ParkingStrategyService }