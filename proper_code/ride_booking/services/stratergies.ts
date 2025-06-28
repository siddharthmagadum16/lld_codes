import { PricingStrategy } from "../interfaces/interface";
import { LocationBasedPricingStrategy, TimeBasedPricingStrategy } from "../stratergies/pricing";
// import { LocationBasedPricingStrategy, TimeBasedPricingStrategy } from "..stratergies/pricing";


class StratergyManager {

  private static instance: StratergyManager;
  private constructor() {}

  public static getInstance = (): StratergyManager => this.instance ?? (this.instance = new StratergyManager());

  public getPricingStrategy = (): PricingStrategy => {
    const isWeatherRainy = true;
    if (isWeatherRainy) return TimeBasedPricingStrategy.getInstance();
    return LocationBasedPricingStrategy.getInstance();
  }

}


export default StratergyManager;