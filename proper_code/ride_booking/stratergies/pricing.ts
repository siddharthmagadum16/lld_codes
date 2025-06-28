import { Location, PricingStrategy } from '../interfaces/interface'



class LocationBasedPricingStrategy implements PricingStrategy {

  private static pricingStrategy: PricingStrategy;
  private constructor() { }
  public getPriceEstimate = (startLoc: Location, endLoc: Location) => {
    return 10 * (Math.abs(startLoc.lat - endLoc.lat) + Math.abs(startLoc.lng - endLoc.lng));
  }

  public static getInstance = () => {
    return this.pricingStrategy ? this.pricingStrategy : this.pricingStrategy = new LocationBasedPricingStrategy();
  }
}

class TimeBasedPricingStrategy implements PricingStrategy {

  private static pricingStrategy: PricingStrategy;
  private constructor() { }
  public getPriceEstimate = (startLoc: Location, endLoc: Location) => {
    return 10 * Math.sqrt(Math.pow(startLoc.lat - endLoc.lat, 2) + Math.pow(startLoc.lng - endLoc.lng, 2))
  }

  public static getInstance = () => {
    return this.pricingStrategy ? this.pricingStrategy : this.pricingStrategy = new TimeBasedPricingStrategy();
  }
}


export {
  LocationBasedPricingStrategy,
  TimeBasedPricingStrategy,
}