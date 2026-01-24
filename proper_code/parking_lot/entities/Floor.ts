import { SpotType } from "../interface";
import { Spot } from "./Spot";

class Floor {
  spots: Map<string, Spot> = new Map();
  
  constructor(spots: Spot[]) {
    spots.forEach((spot:Spot) => this.spots.set(spot.spotId, spot));
  }

  public getAvailableSpots(): Spot[] {
    return Array.from(this.spots.values()).filter((spot: Spot) => !spot.isOccupied());
  }
}

export { Floor, }
