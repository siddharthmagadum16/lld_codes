import { SpotType } from "../interface";
import { Vehicle } from "./Vehicle";


class Spot {
  public vehicleId: string | undefined;
  constructor (
    public spotId: string,
    public spotType: SpotType,
  ) {}

  public parkVehicle(vehicleId: string) {
    this.vehicleId = vehicleId;
  }
  public unParkVehicle() {
    this.vehicleId = undefined;
  }
  public isOccupied(): boolean {
    return !!this.vehicleId;
  }
}

export { Spot }
