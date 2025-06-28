import { Location, PricingStrategy, RidePrice, VehicleType } from '../interfaces/interface'
import StratergyManager from './stratergies';


class PricingService {
  private static instance: PricingService;

  private constructor() {}

  public static getInstance = (): PricingService => this.instance ?? (this.instance = new PricingService())

  public getPriceEstimate(startLoc: Location, endLoc: Location): Record<VehicleType, number> {
    const idealCost = StratergyManager.getPricingStrategy().getPriceEstimate(startLoc, endLoc);

    return {
      [VehicleType.BIKE]: idealCost * 1,
      [VehicleType.AUTO]: idealCost * 1.3,
      [VehicleType.CAR]: idealCost * 1.6,
    }
  }
}

export default PricingService
